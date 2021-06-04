import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'comen-background-control',
  templateUrl: './background-control.component.html',
  styleUrls: ['./background-control.component.scss'],
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BackgroundControlComponent,
      multi: true
    }
  ]
})
export class BackgroundControlComponent implements ControlValueAccessor {

  constructor() { }

  writeValue(){

  }

  registerOnTouched(){

  }

  registerOnChange(){
    
  }
}
