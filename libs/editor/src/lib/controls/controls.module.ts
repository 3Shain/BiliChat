import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveComponentModule } from '@ngrx/component';
import { ColorChromeModule } from 'ngx-color/chrome';
import { ColorControlComponent } from './color-control/color-control.component';
import { FontControlComponent } from './font-control/font-control.component';
import { MarginControlComponent } from './margin-control/margin-control.component';
import { RangeControlComponent } from './range-control/range-control.component';
import { OutlineControlComponent } from './outline-control/outline-control.component';
import { BorderControlComponent } from './border-control/border-control.component';
import { RadiusControlComponent } from './radius-control/radius-control.component';
import { BackgroundControlComponent } from './background-control/background-control.component';
import { DisplayControlComponent } from './display-control/display-control.component';
import { ShadowControlComponent } from './shadow-control/shadow-control.component';

@NgModule({
    declarations: [
        ColorControlComponent,
        MarginControlComponent,
        FontControlComponent,
        RangeControlComponent,
        OutlineControlComponent,
        BorderControlComponent,
        RadiusControlComponent,
        BackgroundControlComponent,
        DisplayControlComponent,
        ShadowControlComponent
    ],
    imports: [
        ReactiveComponentModule,
        ReactiveFormsModule,
        CommonModule,
        ColorChromeModule,
        FlexLayoutModule
    ],
    exports: [
        ColorControlComponent,
        MarginControlComponent,
        FontControlComponent,
        RangeControlComponent,
        OutlineControlComponent,
        BorderControlComponent,
        RadiusControlComponent,
        BackgroundControlComponent,
        DisplayControlComponent,
        ShadowControlComponent
    ]
})
export class ControlsModule {

}