import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { EmptyStateComponent } from './empty-state.component';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule
];

@NgModule({
  declarations: [EmptyStateComponent],
  exports: [EmptyStateComponent],
  imports: [
    CommonModule,
    FlexModule,
    RouterModule,
    MATERIAL_MODULES
  ]
})
export class EmptyStateModule { }
