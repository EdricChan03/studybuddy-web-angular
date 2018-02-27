import { ChatsComponent } from './chats/chats.component';
import { ChatViewerComponent } from './chats/chat-viewer/chat-viewer.component';
import { AboutComponent } from './about/about.component';
import { TipsComponent } from './tips/tips.component';
import { TestpageComponent } from './testpage/testpage.component';
import {
	TodoHomeComponent,
	TodoProjectComponent,
	TodoArchivedComponent,
	TodoDashboardComponent
} from './todo';
import { AppDownloadsComponent } from './appdownloads/appdownloads.component';
import { AppComponent } from './app.component';
import { Route, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { SettingsComponent } from './settings/settings.component';
import { SupportHomeComponent } from './support/support-home/support-home.component';
import { CheatsheetHomeComponent } from './cheatsheets/cheatsheet-home/cheatsheet-home.component';
import { CheatsheetViewerComponent } from './cheatsheets/shared/cheatsheet-viewer/cheatsheet-viewer.component';
import { SupportViewerComponent } from './support/shared/support-viewer/support-viewer.component';

const SUPPORT_ROUTES: Route[] = [
	{ path: 'home', component: SupportHomeComponent },
	{ path: ':id', component: SupportViewerComponent }
];
const CHEATSHEET_ROUTES: Route[] = [
	{ path: 'home', component: CheatsheetHomeComponent },
	{ path: ':id', component: CheatsheetViewerComponent }
]
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
	{ path: 'cheatsheets', children: CHEATSHEET_ROUTES },
	// Chatrooms! Coming soon.
	{ path: 'chats', component: ChatsComponent },
	{ path: 'chats/:id', component: ChatViewerComponent },
	// Automatically redirect users to /todo if none of the routes above match
	{ path: '**', redirectTo: 'todo' }
];

// The routing
export const AppRouting: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
