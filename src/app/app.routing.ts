import { TodoComponent } from './todo/todo.component';
import { AppdownloadsComponent } from './appdownloads/appdownloads.component';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const AppRoutes: Routes = [
	{ path: 'downloads', component: AppdownloadsComponent },
	{ path: 'todo', component: TodoComponent },
	{ path: '**', redirectTo: 'todo' }
]

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(AppRoutes);