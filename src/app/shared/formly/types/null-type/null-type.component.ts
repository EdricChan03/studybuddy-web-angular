import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { FieldTypeConfig } from '@ngx-formly/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'formly-null-type',
  template: ''
})
export class NullTypeComponent extends FieldType<FieldTypeConfig> { }
