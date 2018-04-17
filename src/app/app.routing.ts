import { Route, RouterModule } from '@angular/router';
import {
	TodoArchivedComponent,
	TodoDashboardComponent,
	TodoHomeComponent,
	TodoProjectComponent
} from './todo';

import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { AppComponent } from './app.component';
import { AppDownloadsComponent } from './appdownloads/appdownloads.component';
import { ChatViewerComponent } from './chats/chat-viewer/chat-viewer.component';
import { ChatsComponent } from './chats/chats.component';
import { CheatsheetHomeComponent } from './cheatsheets/cheatsheet-home/cheatsheet-home.component';
import { CheatsheetViewerComponent } from './cheatsheets/shared/cheatsheet-viewer/cheatsheet-viewer.component';
import { ModuleWithProviders } from '@angular/core';
import { NoteNotFoundComponent } from './notes/note-not-found/note-not-found.component';
import { NotesHomeComponent } from './notes/notes-home/notes-home.component';
import { NotesViewerComponent } from './notes/notes-viewer/notes-viewer.component';
import { SettingsComponent } from './settings/settings.component';
import { SupportHomeComponent } from './support/support-home/support-home.component';
import { SupportViewerComponent } from './support/shared/support-viewer/support-viewer.component';
import { TestpageComponent } from './testpage/testpage.component';
import { TipsComponent } from './tips/tips.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const SUPPORT_ROUTES: Route[] = [
	{ path: 'home', component: SupportHomeComponent },
	{ path: ':id', component: SupportViewerComponent }
];

// The routes
export const AppRoutes: Route[] = [
	// Downloads for the app. Currently a bit empty
	{ path: 'downloads', component: AppDownloadsComponent },
	{
		path: 'todo', component: TodoDashboardComponent, children: [
			// All todos
			{ path: 'home', component: TodoHomeComponent },
			// Not working as of now
			{ path: 'archived', component: TodoArchivedComponent },
			// Experimental, currently WIP
			{ path: 'project/:projectId', component: TodoProjectComponent },
			{ path: '**', redirectTo: 'home' }
		]
	},
	// Test links for developers.
	{ path: 'test', component: TestpageComponent },
	// Settings page. Currently a bit broken
	{ path: 'settings', component: SettingsComponent },
	// Tips page.
	{ path: 'tips', component: TipsComponent },
	// Reroutes those going to the old route to the new 'tips' route
	// Note: This **may** be removed in a future release
	{ path: 'resources', redirectTo: '/tips' },
	// About StudyBuddy
	{ path: 'about', component: AboutComponent },
	// Support page
	{ path: 'support', children: SUPPORT_ROUTES },
	// Cheat sheet page
	{ path: 'cheatsheets', component: CheatsheetHomeComponent },
	{ path: 'cheatsheets/:id', component: CheatsheetViewerComponent },
	// Chatrooms! Coming soon.
	{ path: 'chats', component: ChatsComponent },
	{ path: 'chats/:id', component: ChatViewerComponent },
	// Notes
	{ path: 'notes', component: NotesHomeComponent },
	{ path: 'notes/note-not-found', component: NoteNotFoundComponent },
	{ path: 'notes/:id', component: NotesViewerComponent },
	// Account
	{ path: 'account', component: AccountComponent },
	// Login page
	{ path: 'login', component: LoginComponent },
	// Dashboard
	{ path: 'dashboard', component: DashboardComponent },
	// Automatically redirect users to /todo if none of the routes above match
	{ path: '**', redirectTo: 'todo' }
];

// The routing
export const AppRouting: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
