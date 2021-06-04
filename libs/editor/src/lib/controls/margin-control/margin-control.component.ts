import { Component } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
    selector: 'comen-margin-control',
    template: `<div fxLayout="row" [formGroup]="formGroup">
        <div nz-col nzSpan=24>
            <!-- <nz-radio-group [formControl]="mode" nzSize="small" nzButtonStyle="solid">
                <label nz-radio-button nzValue="common">统一</label>
                <label nz-radio-button nzValue="seperate">上/右/下/左</label>
            </nz-radio-group> -->
        </div>
            <!-- <div nz-col nzSpan=6>
                <nz-input-number formControlName="top" nzSize="small" [nzFormatter]="formatterPx"></nz-input-number>
            </div>
            <div nz-col nzSpan=6>
                <nz-input-number formControlName="right" nzSize="small" [nzFormatter]="formatterPx"></nz-input-number>
            </div>
            <div nz-col nzSpan=6>
                <nz-input-number formControlName="bottom" nzSize="small" [nzFormatter]="formatterPx"></nz-input-number>
            </div>
            <div nz-col nzSpan=6>
                <nz-input-number formControlName="left" nzSize="small" [nzFormatter]="formatterPx"></nz-input-number>
            </div> -->
</div>`,
    styleUrls: [
        './margin-control.style.scss'
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: MarginControlComponent,
            multi: true
        }
    ]
})
export class MarginControlComponent implements ControlValueAccessor {

    formatterPx = (value: number) => `${value}px`;
    mode = this.fb.control('common');
    formGroup = this.fb.group({
        top: [0],
        right: [0],
        bottom: [0],
        left: [0]
    })

    constructor(private fb: FormBuilder) { }
    writeValue() {

    }

    registerOnChange() {

    }

    registerOnTouched() {

    }
}