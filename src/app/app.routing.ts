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
import { TodoOutletComponent } from './todo/todo-outlet/todo-outlet.component';
import { AuthGuardService } from './auth-guard.service';
import { TodoDashboardNewComponent } from './todo/todo-dashboard-new/todo-dashboard-new.component';
import { SignupComponent } from './signup/signup.component';

const SUPPORT_ROUTES: Route[] = [
  { path: 'home', component: SupportHomeComponent },
  { path: ':id', component: SupportViewerComponent }
];

// The routes
export const AppRoutes: Route[] = [
  // About StudyBuddy
  { path: 'about', component: AboutComponent },
  // Account
  { path: 'account', component: AccountComponent, canActivate: [AuthGuardService] },
  // Chatrooms! Coming soon.
  { path: 'chats', component: ChatsComponent, canActivate: [AuthGuardService] },
  { path: 'chats/:id', component: ChatViewerComponent, canActivate: [AuthGuardService] },
  // Cheat sheet page
  { path: 'cheatsheets', component: CheatsheetHomeComponent },
  { path: 'cheatsheets/:id', component: CheatsheetViewerComponent },
  // Dashboard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  // Downloads for the app. Currently a bit empty
  { path: 'downloads', component: AppDownloadsComponent },
  // Login page
  { path: 'login', component: LoginComponent },
  // Notes
  { path: 'notes', component: NotesHomeComponent, canActivate: [AuthGuardService] },
  { path: 'notes/note-not-found', component: NoteNotFoundComponent, canActivate: [AuthGuardService] },
  { path: 'notes/:id', component: NotesViewerComponent, canActivate: [AuthGuardService] },
  // Reroutes those going to the old route to the new 'tips' route
  // Note: This **may** be removed in a future release
  { path: 'resources', redirectTo: '/tips' },
  // Settings page. Currently a bit broken
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
  // Sign up page
  { path: 'signup', component: SignupComponent },
  // An alias for signing up
  { path: 'sign-up', redirectTo: '/signup' },
  // Support page
  { path: 'support', children: SUPPORT_ROUTES },
  // Test links for developers.
  { path: 'test', component: TestpageComponent },
  // Tips page.
  { path: 'tips', component: TipsComponent },
  {
    path: 'todo', component: TodoOutletComponent, canActivate: [AuthGuardService], children: [
      // All todos
      { path: 'home', component: TodoHomeComponent },
      // Not working as of now
      { path: 'archived', component: TodoArchivedComponent },
      // Experimental, currently WIP
      { path: 'project/:projectId', component: TodoProjectComponent },
      { path: 'dashboard', component: TodoDashboardComponent },
      { path: 'dashboard-new', component: TodoDashboardNewComponent },
      { path: '**', redirectTo: '/todo/dashboard' }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];

// The routing
export const AppRouting: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
