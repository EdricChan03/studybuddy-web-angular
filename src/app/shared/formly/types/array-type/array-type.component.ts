import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'formly-array-type',
  templateUrl: 'array-type.component.html'
})
export class ArrayTypeComponent extends FieldArrayType { }
