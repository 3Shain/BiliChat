import { Component, OnInit } from '@angular/core';
import { SafeAny } from '@comen/common';
import { zoomBigMotion } from '../../animations';
import { Subject } from 'rxjs';

@Component({
  selector: 'comen-mock-message-edit-dialog',
  templateUrl: './mock-message-edit-dialog.component.html',
  styleUrls: ['./mock-message-edit-dialog.component.scss'],
  animations: [
    zoomBigMotion
  ],
  host:{
    '[@zoomBigMotion]':'"active"'
  }
})
export class MockMessageEditDialogComponent implements OnInit {

  constructor() { }

  close$ = new Subject<SafeAny>();

  ngOnInit(): void {
  }

  close(){
    this.close$.next();
    this.close$.complete();
  }

  save(value){
    this.close$.next();
    this.close$.complete();
  }

}
