import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevelopSharedServiceComponent } from './shared-service/shared-service.component';

const routes: Routes = [
  {
    path: 'shared-service',
    component: DevelopSharedServiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevelopRoutingModule { }
