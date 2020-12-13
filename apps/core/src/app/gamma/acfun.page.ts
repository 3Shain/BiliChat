import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { Message ,MessageProvider, MESSAGE_PROVIDER } from '@comen/gamma';
import { waitUntilVisible } from '../utils/visibility';
import { commentFilter, smoother } from '../core/filter';
import { CommentSource, SOURCE_PROVIDER } from '../core/source';

@Component({
    selector: 'comen-acfun',
    template: `<yt-live-chat-app></yt-live-chat-app>`,
    viewProviders: [{
        provide: MESSAGE_PROVIDER,
        useExisting: AcfunPage
    }]
})
export class AcfunPage implements MessageProvider {

    constructor(
        private activatedRoute: ActivatedRoute,
        private http: HttpClient,
        @Inject(SOURCE_PROVIDER) private sources: CommentSource[]
    ) {
        combineLatest([activatedRoute.params, activatedRoute.queryParams]).pipe(
            waitUntilVisible(),
            switchMap(([param, query]) => {
                return http.get<{ data }>(`api/acfun/info_prefetch?roomid=${param.id}`).pipe(
                    switchMap(({ data }) => {
                        return sources.find(x => x.type == 'acfun').connect(data);
                    })
                )
                // return sources[0].connect({
                //     roomId: param.id
                // }).pipe(
                //     commentFilter({}),
                //     smoother({}));
            }),
            tap((msg) => {
                this.showMessage(msg);
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    private destroy$: Subject<void> = new Subject();
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private showMessage?: (msg: Message) => unknown;
    registerOnMessage(fnMsg: (msg: Message) => unknown) {
        this.showMessage = fnMsg;
    }
}