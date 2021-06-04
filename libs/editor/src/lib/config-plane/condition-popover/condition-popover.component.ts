import { Component, Inject, InjectionToken } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { COMPARE_METHOD_DEFAULT_VALUE, COMPARE_METHOD_MAP, VariantCondition, VariantProperty } from '@comen/common';
import { zoomBigMotion } from '../../animations';
import { defer, merge, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export const VARIANT_PROPERTIES = new InjectionToken<VariantProperty[]>('variant properties');
export const VARIANT_CURRENT_VALUE = new InjectionToken<any>('variant current value');

@Component({
  selector: 'comen-condition-popover',
  templateUrl: './condition-popover.component.html',
  styleUrls: ['./condition-popover.component.scss'],
  animations: [zoomBigMotion],
})
export class ConditionPopoverComponent {

  constructor(
    @Inject(VARIANT_PROPERTIES) public conditionSchema: VariantProperty[],
    @Inject(VARIANT_CURRENT_VALUE) currentValue: VariantCondition,
    private fb: FormBuilder
  ) {
    if (currentValue) {
      const prop = conditionSchema.find(x => x.name == currentValue.property);
      this.formGroup.setValue({
        property: prop,
        method: COMPARE_METHOD_MAP[prop.type].find(x => x.name == currentValue.method),
        target: currentValue.target
      });
      console.log(currentValue.target);
    }
  }

  formGroup = this.fb.group({
    property: [],
    method: [],
    target: []
  });

  compareOptions$ = merge(
    defer(()=>of(this.formGroup.value.property)),
    this.formGroup.get('property').valueChanges
    ).pipe(
      map((x:VariantProperty) => {
        if (x == null) {
          return [];
        }
        const typeList = COMPARE_METHOD_MAP[x.type];
        if(!typeList.find(x=>x.name==this.formGroup.value.method?.name)){
          this.formGroup.patchValue({
            method: typeList[0],
            target: x.defaultValue?? COMPARE_METHOD_DEFAULT_VALUE[x.type]
          });
        }
        return typeList;
      })
    );

  result$ = new Subject<any>();

  clickConfirm() {
    this.result$.next({
      property: this.formGroup.value.property.name,
      method: this.formGroup.value.method.name,
      target: this.formGroup.value.target
    });
    this.result$.complete();
  }
}