import { ResourcesComponent } from './resources/resources.component';
import { TestpageComponent } from './testpage/testpage.component';
import { TodoComponent } from './todo/todo.component';
import { AppdownloadsComponent } from './appdownloads/appdownloads.component';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { SettingsComponent } from './settings/settings.component';

export const AppRoutes: Routes = [
	{ path: 'downloads', component: AppdownloadsComponent },
	{ path: 'todo', component: TodoComponent },
	{ path: 'test', component: TestpageComponent },
	{ path: 'settings', component: SettingsComponent },
	{ path: 'resources', component: ResourcesComponent },
	{ path: '**', redirectTo: 'todo' }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
