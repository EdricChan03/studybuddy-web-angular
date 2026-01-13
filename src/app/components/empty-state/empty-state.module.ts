import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
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
    RouterModule,
    MATERIAL_MODULES
  ]
})
export class EmptyStateModule { }
