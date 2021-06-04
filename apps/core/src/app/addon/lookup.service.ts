import { HttpClient } from '@angular/common/http';
import {
    Compiler,
    Injectable,
    Injector,
    NgModuleFactory,
    NgModuleRef,
    Type,
} from '@angular/core';
import { SafeAny } from '@comen/common';
import { AddonService } from './addon.service';
import {
    BuiltinOverlayModule,
    BuiltinSourceModule,
    OverlayInfo,
    SourceInfo,
} from './definations';
import { preloadDelta } from '@comen/delta';

type LazyLoadStaticCallback = () => Promise<NgModuleFactory<any> | Type<any>>;

@Injectable()
export class LookupService {
    readonly BUILT_IN_OVERLAY: OverlayInfo[] = [
        {
            name: 'gamma',
            displayName: '评论栏',
            icon: '/assets/icon_gamma.png',
            version: '1.0.0',
            preload: async () => {
                const module = await this.lazyloadNgModule<BuiltinOverlayModule>(
                    () => import('@comen/gamma').then((m) => m.GammaModule)
                );
                this.addon.registerBuiltinOverlay(
                    module.instance.metadata,
                    module.instance.entry,
                    module.componentFactoryResolver
                );
            },
        },
        {
            name: 'delta',
            displayName: '评论栏 v2',
            icon: '/assets/icon_gamma.png',
            version: '0.0.0',
            preload: preloadDelta
        },
    ];

    readonly BUILT_IN_SOURCE: SourceInfo[] = [
        {
            name: 'bilibili',
            version: '1.0.0',
            displayName: '哔哩哔哩',
            preload: async () => {
                const module = await this.lazyloadNgModule<BuiltinSourceModule>(
                    () =>
                        import('../sources/bilibili/bilibili.module').then(
                            (m) => m.BilibiliSourceModule
                        )
                );
                this.addon.registerBuiltinSource(
                    'bilibili',
                    module.injector.get(module.instance.source)
                );
            },
        },
        {
            name: 'acfun',
            version: '1.0.0',
            displayName: 'AcFun',
            preload: async () => {
                const module = await this.lazyloadNgModule<BuiltinSourceModule>(
                    () =>
                        import('../sources/acfun/acfun.module').then(
                            (m) => m.AcfunSourceModule
                        )
                );
                this.addon.registerBuiltinSource(
                    'bilibili',
                    module.injector.get(module.instance.source)
                );
            },
        },
    ];

    constructor(
        private addon: AddonService,
        private injector: Injector,
        private compiler: Compiler,
        private http: HttpClient
    ) {}

    async getOverlays() {
        return [...this.BUILT_IN_OVERLAY];
    }

    async getSources() {
        return [...this.BUILT_IN_SOURCE];
    }

    async ensureSourceLoaded(name: string) {
        if (this.addon.isSourceExist(name)) {
            return (await this.getSources()).find((x) => x.name == name);
        }
        const target = (await this.getSources()).find((x) => x.name == name);
        if (target) {
            await target.preload();
            return target;
        }
        throw 'NO SUCH SOURCE';
    }

    async ensureOverlayLoaded(name: string) {
        if (this.addon.isOverylayExist(name)) {
            return (await this.getOverlays()).find((x) => x.name == name);
        }
        const target = (await this.getOverlays()).find((x) => x.name == name);
        if (target) {
            await target.preload();
            return target;
        }
        throw 'NO SUCH SOURCE';
    }

    private async lazyloadNgModule<T = SafeAny>(load: LazyLoadStaticCallback) {
        let ngf = await load();
        if (!(ngf instanceof NgModuleFactory)) {
            ngf = await this.compiler.compileModuleAsync(ngf);
        }
        return ngf.create(this.injector) as NgModuleRef<T>;
    }
}
