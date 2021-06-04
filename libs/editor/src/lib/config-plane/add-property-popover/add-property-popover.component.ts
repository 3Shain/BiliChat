import { Component, Inject, InjectionToken } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { COMPARE_METHOD_DEFAULT_VALUE, COMPARE_METHOD_MAP, VariantCondition, VariantProperty } from '@comen/common';
import { zoomBigMotion } from '../../animations';

@Component({
  selector: 'comen-add-property-popover',
  templateUrl: './add-property-popover.component.html',
  styleUrls: ['./add-property-popover.component.scss'],
  animations: [zoomBigMotion],
})
export class AddPropertyPopoverComponent {

  constructor(
    private fb: FormBuilder
  ) {
    
  }

}