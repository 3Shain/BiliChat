import { Component } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'comen-shadow-control',
  templateUrl: './shadow-control.component.html',
  styleUrls: ['./shadow-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ShadowControlComponent,
      multi: true
    }
  ]
})
export class ShadowControlComponent implements ControlValueAccessor {

  constructor(private fb:FormBuilder) { }

  formGroup = this.fb.group({
    color:['rgba(0,0,0,0.5)'],
    x:[0],
    y:[0],
    spread:[0],
    blur: [0],
    inset: [false]
  });

  writeValue(){
    
  }

  registerOnChange(){

  }

  registerOnTouched(){

  }

}
