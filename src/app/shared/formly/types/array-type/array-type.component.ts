import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'formly-array-type',
  templateUrl: 'array-type.component.html'
})
export class ArrayTypeComponent extends FieldArrayType { }
