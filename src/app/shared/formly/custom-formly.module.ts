import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormlyModule } from '@ngx-formly/core';
import { ArrayTypeComponent } from './types/array-type/array-type.component';
import { NullTypeComponent } from './types/null-type/null-type.component';
import { ObjectTypeComponent } from './types/object-type/object-type.component';
import { PanelWrapperComponent } from './wrappers/panel-wrapper.component';

const COMPONENTS = [
  ArrayTypeComponent,
  NullTypeComponent,
  ObjectTypeComponent,
  PanelWrapperComponent
];

const MATERIAL_MODULES = [
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatTooltipModule
];

@NgModule({
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ],
  imports: [
    CommonModule,
    FormlyModule.forChild({
      wrappers: [
        { name: 'panel', component: PanelWrapperComponent }
      ],
      // JSON schema support
      types: [
        { name: 'string', extends: 'input' },
        {
          name: 'number',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number'
            }
          }
        },
        {
          name: 'integer',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number'
            }
          }
        },
        { name: 'boolean', extends: 'checkbox' },
        { name: 'enum', extends: 'select' },
        { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
        {
          name: 'array', component: ArrayTypeComponent, defaultOptions: {
            templateOptions: {
              useAccordion: true
            }
          }
        },
        {
          name: 'object', component: ObjectTypeComponent, defaultOptions: {
            templateOptions: {
              hideFieldLabel: false,
              hideFieldDesc: false
            }
          }
        },
      ]
    }),
    MATERIAL_MODULES
  ]
})
export class CustomFormlyModule { }
