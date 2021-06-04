import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConfigurationSection, PropertySchema, SafeAny } from '@comen/common';
import { faRemoveFormat } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'comen-config-block',
  templateUrl: './config-block.component.html',
  styleUrls: ['./config-block.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: ConfigBlockComponent, multi: true }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigBlockComponent implements OnInit, ControlValueAccessor {

  allVisiable = false;
  _visibleProps: {
    [key: string]: PropertySchema
  } = {};
  _invisibleProps: {
    [key: string]: PropertySchema
  } = {};

  @Input() sectionSetting: ConfigurationSection;

  propertiesFormGroup: FormGroup;

  addFromControl = this.fb.control(null);

  constructor(
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.propertiesFormGroup = this.fb.group(
      Object.fromEntries(Object.entries(this.sectionSetting.properties).map(([key, schema]) => {
        return [key, [schema.defaultValue]];
      }))
    );
    this.addFromControl.valueChanges.subscribe(_ => {
      if (_ != null) {
        this._visibleProps[_] = this._invisibleProps[_];
        delete this._invisibleProps[_];
        this.checkAllVisible();
        this.changeDetector.markForCheck();
        this.propertiesFormGroup.patchValue({
          [_]: this._visibleProps[_].defaultValue
        });
        this.addFromControl.setValue(null);
      }
    });
  }

  checkAllVisible() {
    if (!Object.keys(this._invisibleProps).length) {
      this.allVisiable = true;
    }
  }

  trackFn<K, V>(node: KeyValue<K, V>) {
    return node.key;
  }

  noorder() {
    return 1;
  }

  removeProperty(_) {
    this._invisibleProps[_] = this._visibleProps[_];
    delete this._visibleProps[_];
    this.allVisiable = false;
    this.propertiesFormGroup.patchValue({
      [_]: this._invisibleProps[_].defaultValue
    });
    this.changeDetector.markForCheck();
  }

  writeValue(value: SafeAny) {
    if (value != null) {
      this._invisibleProps = { ...this.sectionSetting.properties };
      Object.entries(value).forEach(([key]) => {
        this._visibleProps[key] = this._invisibleProps[key];
        delete this._invisibleProps[key];
      });
      this.checkAllVisible();
      this.propertiesFormGroup.patchValue(value, { emitEvent: false });
      this.changeDetector.markForCheck();
    }
  }

  registerOnChange(callback: (v: SafeAny) => void) {
    this.propertiesFormGroup.valueChanges.subscribe(props => {
      callback(Object.fromEntries(Object.entries(props).filter(([prop]) => {
        return this._visibleProps[prop] != undefined;
      })));
    });
  }
  registerOnTouched() {
  }
}