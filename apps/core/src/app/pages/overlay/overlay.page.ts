import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    ComenEnvironmentHost,
    Message,
    SafeAny,
    TextMessage,
} from '@comen/common';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, filter, retry, takeUntil, tap } from 'rxjs/operators';
import { AddonService } from '../../addon/addon.service';
import { OverlayContainerComponent } from '../../addon/overlay-container.component';
import { commentFilter, folder, smoother } from '../../common';
import { deserializeBase64 } from '../../common/base64';
import { emojiFilter } from '../../common/emoji';
import { RxZone } from '../../common/rx';
import { nextFrame, waitUntilPageVisible } from '../../common/utils';
import {
    ComenConfiguration,
    DEFAULT_CONFIG,
    mergeQueryParameters,
} from '../../config';

const BILICHAT_SYSTEM_MESSAGE = {
    FETCHING: '正在获取直播间信息...',
    CONNECTING: '正在连接到直播间...',
    CONNECTED: '成功连接到直播间!',
    ERROR: '检测到服务器断开,尝试重连中...',
};

@Component({
    selector: 'comen-overlay',
    template: `<comen-overlay-container
            #container="overlayContainer"
        ></comen-overlay-container>
        <div id="comen-configuration-data" #data></div>`,
    styles: [
        `
            #comen-configuration-data {
                display: none;
            }
            :host {
                display: block;
                height: 100vh;
                width: 100vw;
            }
        `,
    ],
    viewProviders: [
        RxZone,
        {
            provide: ComenEnvironmentHost,
            useExisting: OverlayPage,
        },
    ],
})
// eslint-disable-next-line
export class OverlayPage
    extends ComenEnvironmentHost
    implements OnInit, OnDestroy {
    @ViewChild('data', { static: true }) data: ElementRef<HTMLDivElement>;
    @ViewChild('container', { static: true })
    container: OverlayContainerComponent;

    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private rxzone: RxZone,
        private addon: AddonService
    ) {
        super();
    }

    get addonTarget() {
        return this.activatedRoute.snapshot.queryParams.o ?? 'null';
    }

    message$: Subject<Message> = new Subject();
    legacyConfig$: Subject<ComenConfiguration> = new Subject();

    private _configs: {
        [key: string]: Observable<SafeAny>;
    } = {};

    private _variantPipes: {
        [key: string]: Observable<SafeAny>;
    } = {};

    async ngOnInit() {
        await waitUntilPageVisible();
        // init element?
        const queryParams = this.activatedRoute.snapshot.queryParams;
        // Query parameters are not expected to change. Any change is not responsed
        // unless component is fully reconstructed.
        const injectedConfiguration = await this.initConfig();
        const globalConfig = mergeQueryParameters(queryParams, {
            ...DEFAULT_CONFIG,
            ...(injectedConfiguration?.config?.['@@global']?.default ?? {}),
        });

        if (injectedConfiguration.config) {
            Object.entries(injectedConfiguration.config).forEach(
                ([key, value]: [string, SafeAny]) => {
                    this._configs[key] = new BehaviorSubject(value.default);
                    if (value.variantsPipe) {
                        this._variantPipes[key] = new BehaviorSubject(
                            new Function('c', value.variantsPipe)
                        );
                    }
                }
            );
        }

        const bootstraped = this.container.bootstrap(this.addonTarget);
        this.destroy$.subscribe(() => bootstraped.destroy());

        this.legacyConfig$.next(globalConfig);
        if ('bilichat' in globalConfig) {
            setTimeout(() => {
                // here showMessage is expected not undefined!
                this.message$.next({
                    type: 'blank',
                });
            }, 0);
        }
        this.addon
            .connectSource(globalConfig.platform, globalConfig)
            .pipe(
                filter(() => document.visibilityState == 'visible'),
                // this is important! because some filter depend on requestAnimationFrame will cause some weired behavior
                commentFilter(globalConfig),
                smoother(globalConfig),
                folder(globalConfig),
                filter((msg) => {
                    if ('bilichat' in globalConfig) {
                        if (msg.type == 'system') {
                            this.message$.next({
                                type: 'text',
                                content:
                                    BILICHAT_SYSTEM_MESSAGE[msg.data.status],
                                avatar: '/assets/bilichat_icon.png',
                                usertype: 0b10,
                                username: 'BILICHAT',
                            } as TextMessage);
                        } else if (msg.type == 'sticker') {
                            // bilichat has no sticker type, downgrade to mock paid message
                            this.message$.next({
                                type: 'paid',
                                itemInfo: msg.itemInfo,
                                price: msg.price,
                                content: null,
                                avatar: msg.avatar,
                                username: msg.username,
                                platformUserId: msg.platformUserId,
                            });
                            return false;
                        }
                    }
                    return true;
                }),
                emojiFilter(globalConfig),
                tap((msg) => {
                    this.message$.next(msg);
                }),
                catchError((e) => {
                    if (e == 'NOT_FOUND') {
                        console.error('ADDON NOT FOUND'); // TODO: Error UI
                        return of();
                    }
                    console.error(e);
                    throw e;
                }),
                retry(), //TODO: endless retry will cause stackoverflow
                this.rxzone.subscribeOutsideAngular(),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    message() {
        return this.message$;
    }

    config(section: string) {
        if (section == '__legacy__') {
            return this.legacyConfig$;
        }
        return this._configs[section] ?? of({});
    }

    variantPipe(section: string) {
        return this._variantPipes[section] ?? of((x: unknown) => x);
    }

    assetUrl(id: string) {
        return '';
    }

    async initConfig() {
        // config in css
        if ('obsstudio' in window) {
            let retryCount = 0;
            while (retryCount < 60) {
                await nextFrame();
                const ret = getComputedStyle(this.data.nativeElement, ':after')
                    .content;
                if (ret != 'none') {
                    return deserializeBase64(ret.substring(1, ret.length - 1));
                }
                retryCount++;
            }
            return {};
        }
        return {};
    }
}
