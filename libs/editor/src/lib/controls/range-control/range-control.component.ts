import { Component, Input } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'comen-range-control',
  templateUrl: './range-control.component.html',
  styleUrls: ['./range-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RangeControlComponent,
      multi: true
    }
  ]
})
export class RangeControlComponent implements ControlValueAccessor {

  @Input() max = 1;
  @Input() min = 0;
  @Input() step = 0.01;

  constructor(private fb: FormBuilder) {
    this.sliderControl.valueChanges.pipe(tap(x => {
      if (this.numberInputControl.value != x) {
        this.numberInputControl.setValue(x);
      }
      this.changeCallback?.(x);
    })).subscribe();
    this.numberInputControl.valueChanges.pipe(tap(x => {
      if (this.sliderControl.value != x) {
        this.sliderControl.setValue(x);
      }
    })).subscribe();
  }

  sliderControl = this.fb.control(0);
  numberInputControl = this.fb.control(0);

  writeValue(value: number) {
    this.sliderControl.setValue(value);
    this.numberInputControl.setValue(value);
    /**
     * writeValue is supposed to be called before registerOnChange
     */
  }

  changeCallback: Function;
  registerOnChange(callback: Function) {
    this.changeCallback = callback;
  }

  registerOnTouched() {

  }

}
