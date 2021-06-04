import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockObsDialogComponent } from './mock-obs-dialog.component';



@NgModule({
  declarations: [MockObsDialogComponent],
  imports: [
    CommonModule
  ],
  exports: [MockObsDialogComponent]
})
export class MockObsDialogModule { }
