import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { FieldTypeConfig } from '@ngx-formly/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'formly-null-type',
  template: ''
})
export class NullTypeComponent extends FieldType<FieldTypeConfig> { }
