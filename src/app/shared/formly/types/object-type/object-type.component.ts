import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'formly-object-type',
  template: `
    <legend *ngIf="to.label && !to['hideFieldLabel']">{{ to.label }}</legend>
    <p *ngIf="to.description && !to['hideFieldDesc']">{{ to.description }}</p>
    <!--<div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
      <formly-validation-message [field]="field"></formly-validation-message>
    </div>-->

    <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
  `,
})
export class ObjectTypeComponent extends FieldType {
  defaultOptions = {
    defaultValue: {},
  };
}
