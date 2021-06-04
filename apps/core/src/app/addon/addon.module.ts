import { ModuleWithProviders, NgModule } from '@angular/core';
import { AddonService } from './addon.service';
import { DebugGuard } from './debug.guard';
import { LookupService } from './lookup.service';
import { AddonLazyloadResolver } from './addon-lazyload.resolve';
import { OverlayContainerComponent } from './overlay-container.component';

@NgModule({
    declarations: [OverlayContainerComponent],
    imports: [],
    exports: [OverlayContainerComponent]
})
export class AddonMoudle {
    static forRoot(): ModuleWithProviders<AddonMoudle> {
        return {
            ngModule: AddonMoudle,
            providers: [
                AddonService,
                AddonLazyloadResolver,
                DebugGuard,
                LookupService
            ]
        }
    }
}