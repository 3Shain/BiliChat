import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditorModule } from '@comen/editor';
import { AddonMoudle } from '../../addon/addon.module';
import { EditPage } from './edit.page';
import { MockObsDialogModule } from './mock-obs-dialog/mock-obs-dialog.module';
import { RestoreSessionResovler } from './restore.resolver';


@NgModule({
    declarations: [EditPage],
    imports: [
        CommonModule,
        EditorModule,
        RouterModule.forChild([{
            path: '',
            component: EditPage,
            resolve: {
                session: RestoreSessionResovler
            }
        }]),
        AddonMoudle,
        MockObsDialogModule
    ],
    providers: [RestoreSessionResovler]
})
export class EditModule { }