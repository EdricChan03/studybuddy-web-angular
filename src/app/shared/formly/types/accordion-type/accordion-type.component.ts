import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'formly-accordion-type',
  templateUrl: './accordion-type.component.html'
})
/**
 * @deprecated Use `ArrayTypeComponent` which supports an accordion
 * and the original behaviour. (Specify the `useAccordion` value in
 * `templateOptions` to enable this)
 */
export class AccordionTypeComponent extends FieldArrayType { }
