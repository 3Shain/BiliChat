import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'comen-radius-control',
  templateUrl: './radius-control.component.html',
  styleUrls: ['./radius-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadiusControlComponent,
      multi: true
    }
  ]
})
export class RadiusControlComponent implements ControlValueAccessor {


  mode = this.fb.control('single');

  single = this.fb.control(0);

  formGroup = this.fb.group({
    value1: [0],
    value2: [0],
    value3: [0],
    value4: [0],
    unit: ['px']
  });

  constructor(private fb: FormBuilder) {
    this.single.valueChanges.subscribe(v => {
      this.formGroup.patchValue({
        value1: v,
        value2: v,
        value3: v,
        value4: v,
      });
    });
  }

  writeValue(v) {
    if (v != null) {
      this.formGroup.setValue({
        value1: v.value[0],
        value2: v.value[1],
        value3: v.value[2],
        value4: v.value[3],
        unit: v.unit
      });
    }
  }

  registerOnChange(callback: (v) => void) {
    this.formGroup.valueChanges.subscribe((v) => {
      callback({
        value: [v.value1, v.value2, v.value3, v.value4],
        unit: v.unit
      });
    });
  }

  registerOnTouched() {

  }
}
