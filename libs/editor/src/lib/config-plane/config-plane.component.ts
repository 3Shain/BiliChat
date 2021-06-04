import { Component, Input } from '@angular/core';
import { ControlValueAccessor, FormArray, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConfigurationSection, SafeAny, VariantCondition } from '@comen/common';

@Component({
  selector: 'comen-config-plane',
  templateUrl: './config-plane.component.html',
  styleUrls: ['./config-plane.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ConfigPlaneComponent,
    multi: true
  }]
})
export class ConfigPlaneComponent implements ControlValueAccessor {

  @Input() sectionSetting: ConfigurationSection;

  constructor(private fb: FormBuilder) { }

  formGroup = this.fb.group({
    default: this.fb.control({}),
    variants: this.fb.array([])
  });

  get variantsFormArray() {
    return this.formGroup.get('variants') as FormArray;
  }

  get vairantProperties() {
    return this.sectionSetting.variantProperties;
  }

  addNewVariant(condition: VariantCondition) {
    this.variantsFormArray.push(this.fb.group({
      condition: [[condition]],
      properties: [{}]
    }));
  }

  removeVariant(index: number) {
    this.variantsFormArray.removeAt(index);
  }

  moveUpVariant(index: number) {
    if (index <= 0) {
      return;
    }
    const control = this.variantsFormArray.at(index);
    this.variantsFormArray.setControl(index, this.variantsFormArray.at(index - 1));
    this.variantsFormArray.setControl(index - 1, control);
  }

  moveDownVariant(index: number) {
    if (index >= this.variantsFormArray.length - 1) {
      return;
    }
    const control = this.variantsFormArray.at(index);
    this.variantsFormArray.setControl(index, this.variantsFormArray.at(index + 1));
    this.variantsFormArray.setControl(index + 1, control);
  }

  writeValue(value: {
    default: SafeAny,
    variants: {
      condition: SafeAny[],
      properties: SafeAny
    }[]
  }) {
    value.variants?.forEach(val => {
      this.variantsFormArray.push(this.fb.group({
        condition: this.fb.control(val.condition),
        properties: val.properties
      }));
    });
    this.formGroup.get('default').setValue(value.default, { emitEvent: false });
  }

  registerOnChange(callback: (val: SafeAny) => unknown) {
    this.formGroup.valueChanges.subscribe(callback);
  }

  registerOnTouched() {
    // stub method
  }
}
