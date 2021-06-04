import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import {
    ApplicationRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Injector,
    NgZone,
    ViewEncapsulation,
} from '@angular/core';
import { ComenEnvironmentHost } from '@comen/common';
import { AddonService } from './addon.service';

@Component({
    selector: 'comen-overlay-container',
    template: ``,
    styles: [`comen-overlay-container {
        display: block;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }`],
    encapsulation: ViewEncapsulation.None,
    exportAs: 'overlayContainer',
})
export class OverlayContainerComponent {
    constructor(
        private element: ElementRef<HTMLElement>,
        private addon: AddonService,
        private cfr: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private zone: NgZone,
        private inj: Injector
    ) {}

    bootstrap(addonName: string) {
        const root = this.element.nativeElement.attachShadow({ mode: 'open' });
        const htmlElement = root.appendChild(document.createElement('html'));
        htmlElement.style.height = '100%';
        htmlElement.style.overflow = 'hidden';
        htmlElement.appendChild(
            document.createElement('head')
        );
        const bodyElement = htmlElement.appendChild(
            document.createElement('body')
        );
        bodyElement.style.height = '100%';
        const addon = this.addon.getOverlay(addonName);
        if (!addon) {
            throw 'NOT_FOUND';
        }
        if (addon.ngComponent) {
            const outlet = new DomPortalOutlet(
                bodyElement,
                this.cfr,
                this.appRef,
                this.inj,
                root
            );
            const portal = new ComponentPortal(addon.ngComponent);
            outlet.attach(portal);
            return {
                element: this.element.nativeElement,
                destroy: () => outlet.dispose(),
            };
        } else {
            const host = this.inj.get(ComenEnvironmentHost);
            const dispose = this.zone.runOutsideAngular(() =>
                 addon.entry({
                    message: host.message.bind(host),
                    variantPipe: host.variantPipe.bind(host),
                    config: host.config.bind(host),
                    rootElement: root,
                })
            );

            return {
                element: this.element.nativeElement,
                destroy: () => {
                    dispose();
                },
            };
        }
    }
}
