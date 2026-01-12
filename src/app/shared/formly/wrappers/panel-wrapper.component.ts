import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'formly-wrapper-panel',
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>{{ to.label }}</mat-panel-title>
        <mat-panel-description *ngIf="to.description">{{ to.description }}</mat-panel-description>
      </mat-expansion-panel-header>
      <ng-template #fieldComponent></ng-template>
    </mat-expansion-panel>
  `
})
export class PanelWrapperComponent extends FieldWrapper {
  @ViewChild('fieldComponent', { read: ViewContainerRef, static: true }) fieldComponent: ViewContainerRef;
}
