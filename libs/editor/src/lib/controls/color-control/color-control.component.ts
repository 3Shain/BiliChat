import { animate, style, transition, trigger } from '@angular/animations';
import { Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, ElementRef, HostListener, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SafeAny } from '@comen/common';
import { ColorEvent } from 'ngx-color';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  template: `<div id="checkbox" >
    <div id="block" [ngStyle]="{'background-color':currentColor|ngrxPush}">
  </div>
  <ng-template #temp>
      <div [@inout]>
      <color-chrome [color]="currentColor | ngrxPush" (onChange)="handleChange($event)" ></color-chrome>
  </div>
      </ng-template>`,
  selector: 'comen-color-control',
  styles: [
    `
      :host {
        display: inline-block;
      }
      #block {
          display: inline-block;
          height: 100%;
          width: 3em;
          overflow:hidden;
          border: solid 1px #ddddde;
          border-radius: 4px;
          cursor: pointer;
      }

      #checkbox {
        display: block;
        height: 1.5em;
        width: 3em;
        border-radius: 4px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==);
        background-position: center;
        background-repeat: repeat;
      }
      `
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ColorControlComponent
    }
  ],
  animations: [
    trigger('inout', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale3d(0.95,0.95,0.95)'
        }),
        animate(30, style({
          opacity: 1,
          transform: 'scale3d(1,1,1)'
        }))
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'scale3d(1,1,1)'
        }),
        animate(30, style({
          opacity: 0,
          transform: 'scale3d(0.95,0.95,0.95)'
        }))
      ])
    ])
  ]
})
export class ColorControlComponent implements ControlValueAccessor {

  @ViewChild('temp') temp: TemplateRef<SafeAny>;

  currentColor: BehaviorSubject<string> = new BehaviorSubject('#cccccc');

  constructor(private overlay: Overlay, private ele: ElementRef, private vc: ViewContainerRef) { }
  ref = this.overlay.create({
    hasBackdrop: true,
    backdropClass: 'cdk-backdrop-transparent',
    positionStrategy: this.overlay.position().flexibleConnectedTo(this.ele).withPositions([{
      offsetX: -30,
      offsetY: 0,
      overlayX: 'start',
      overlayY: 'center',
      originX: 'start',
      originY: 'center'
    },
    {
      offsetX: -30,
      offsetY: 0,
      overlayX: 'start',
      overlayY: 'top',
      originX: 'start',
      originY: 'center'
    }, {
      offsetX: -30,
      offsetY: 0,
      overlayX: 'start',
      overlayY: 'bottom',
      originX: 'start',
      originY: 'center'
    }]),
    scrollStrategy: this.overlay.scrollStrategies.close()
  });

  handleChange(e: ColorEvent) {
    this.currentColor.next(`rgba(${e.color.rgb.r},${e.color.rgb.g},${e.color.rgb.b},${e.color.rgb.a})`);
    this.changeFn?.(`rgba(${e.color.rgb.r},${e.color.rgb.g},${e.color.rgb.b},${e.color.rgb.a})`);
    this.touchFn?.();
  }

  @HostListener('click')
  click() {
    this.ref.attach(new TemplatePortal(this.temp, this.vc));
    this.ref.backdropClick().pipe(take(1)).subscribe(() => {
      this.ref.detach();
    });
  }


  writeValue(obj: string): void {
    if (obj == null) {
      throw 'NOT EXPECTED VALUE';
    }
    this.currentColor.next(obj);
  }

  changeFn: SafeAny;

  registerOnChange(fn: SafeAny): void {
    this.changeFn = fn;
  }

  touchFn: SafeAny;
  registerOnTouched(fn: SafeAny): void {
    this.touchFn = fn;
  }

}
