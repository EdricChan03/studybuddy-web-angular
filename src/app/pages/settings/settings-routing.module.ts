import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsOutletComponent } from './settings-outlet/settings-outlet.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsOutletComponent,
    loadChildren: () => import('./panels/settings-panels.module').then(m => m.SettingsPanelsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
