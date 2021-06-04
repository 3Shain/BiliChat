import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConditionPopoverComponent } from './config-plane/condition-popover/condition-popover.component';
import { ConditionPopoverDirective } from './config-plane/condition-popover/condition-popover.directive';
import { ConfigBlockComponent } from './config-plane/config-block/config-block.component';
import { ConfigConditionComponent } from './config-plane/config-condition/config-condition.component';
import { ConfigPlaneComponent } from './config-plane/config-plane.component';
import { ControlsModule } from './controls/controls.module';
import { EditorComponent } from './editor.component';
import { ElementTreeNodeDirective } from './element-tree-plane/element-tree-node.directive';
import { ElementTreePlaneComponent } from './element-tree-plane/element-tree-plane.component';
import { MockMessagePlaneComponent } from './mock-message-plane/mock-message-plane.component';
import { MockMessageEditDialogComponent } from './mock-message-plane/mock-message-edit-dialog/mock-message-edit-dialog.component';

@NgModule({
    declarations: [
        EditorComponent,
        ElementTreePlaneComponent,
        ElementTreeNodeDirective,
        ConfigBlockComponent,
        ConfigConditionComponent,
        ConfigPlaneComponent,
        ConditionPopoverComponent,
        ConditionPopoverDirective,
        MockMessagePlaneComponent,
        MockMessageEditDialogComponent,
    ],
    imports: [
        CommonModule,
        ControlsModule,
        OverlayModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        ReactiveComponentModule,
        FontAwesomeModule
    ],
    exports: [EditorComponent],
})
export class EditorModule {}
