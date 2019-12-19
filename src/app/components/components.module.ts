import { NgModule } from '@angular/core';
import { EmptyStateModule } from './empty-state/empty-state.module';
import { ToolbarModule } from './toolbar/toolbar.module';

@NgModule({
  exports: [
    EmptyStateModule,
    ToolbarModule
  ]
})
export class ComponentsModule { }
