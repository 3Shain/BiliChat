import { Component } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'comen-border-control',
  templateUrl: './border-control.component.html',
  styleUrls: ['./border-control.component.scss'],
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting:BorderControlComponent,
    multi: true
  }]
})
export class BorderControlComponent implements ControlValueAccessor {

  constructor(private fb:FormBuilder) { }

  writeValue(){

  }

  registerOnChange(){

  }

  registerOnTouched(){

  }

}
