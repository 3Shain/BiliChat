import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddonMoudle } from '../../addon/addon.module';
import { OverlayPage } from './overlay.page';


@NgModule({
    declarations: [OverlayPage],
    imports: [
        CommonModule,
        AddonMoudle,
        RouterModule.forChild([{
            path: '',
            component: OverlayPage
        }])
    ]
})
export class OverlayModule { }