import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
    Directive, ElementRef, EventEmitter, HostListener,
    Injector, Input, Output, ViewContainerRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatConditionString, SafeAny, VariantCondition, VariantProperty } from '@comen/common';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConditionPopoverComponent, VARIANT_CURRENT_VALUE, VARIANT_PROPERTIES } from './condition-popover.component';

@Directive({
    selector: '*[conditionPopover]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: ConditionPopoverDirective,
        multi: true
    }]
})
export class ConditionPopoverDirective implements ControlValueAccessor {
    constructor(private overlay: Overlay,
        private element: ElementRef<HTMLElement>,
        private vcr: ViewContainerRef,
        private inj: Injector) { }

    @Input() variantProperties: VariantProperty[] = [{
        type: 'text',
        displayName: '测试属性1',
        'x-icon': 'user',
        name: 'test1'
    }, {
        type: 'number',
        displayName: '测试属性2',
        'x-icon': 'user',
        name: 'test2'
    }];

    @Output() input = new EventEmitter<VariantCondition>();

    @HostListener('click')
    click() {
        const ref = this.overlay.create({
            width: '340px',
            hasBackdrop: true,
            backdropClass: 'cdk-transparent-overlay',
            positionStrategy: this.overlay.position().flexibleConnectedTo(this.element).withPositions(
                [{
                    offsetX: -10,
                    offsetY: 6,
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'top'
                }]
            ),
        });

        const injector = Injector.create({
            parent: this.inj,
            providers: [
                {
                    provide: VARIANT_PROPERTIES, useValue: this.variantProperties
                },
                {
                    provide: VARIANT_CURRENT_VALUE, useValue: this.currentValue
                }
            ]
        });
        const instance = ref.attach(
            new ComponentPortal(ConditionPopoverComponent, this.vcr, injector)
        );

        merge(ref.backdropClick().pipe(map(x => null)), instance.instance.result$).subscribe(_ => {
            ref.detach();
            if (_ != null) {
                this.input.next(_);
                if (this.changeCallback) { // this is a formControl
                    this.currentValue = _;
                    this.changeCallback?.(_);
                    this.element.nativeElement.textContent = formatConditionString(_, this.variantProperties)
                }
            }
        });
    }

    currentValue: VariantCondition = null;

    writeValue(value: VariantCondition) {
        this.currentValue = value;
        this.element.nativeElement.textContent = formatConditionString(value, this.variantProperties)
    }

    changeCallback?: SafeAny;
    registerOnChange(change: SafeAny) {
        this.changeCallback = change;
    }

    registerOnTouched() {

    }
}