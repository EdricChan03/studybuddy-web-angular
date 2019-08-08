import { ModuleWithProviders } from '@angular/core';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Route, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { AppDownloadsComponent } from './appdownloads/appdownloads.component';
import { AuthGuardService } from './auth-guard.service';
import { ChatExploreComponent } from './chats/chat-explore/chat-explore.component';
import { ChatViewerComponent } from './chats/chat-viewer/chat-viewer.component';
import { ChatsComponent } from './chats/chats.component';
import { CheatsheetHomeComponent } from './cheatsheets/cheatsheet-home/cheatsheet-home.component';
import { CheatsheetViewerComponent } from './cheatsheets/shared/cheatsheet-viewer/cheatsheet-viewer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NoteNotFoundComponent } from './notes/note-not-found/note-not-found.component';
import { NotesHomeComponent } from './notes/notes-home/notes-home.component';
import { NotesViewerComponent } from './notes/notes-viewer/notes-viewer.component';
import { SettingsComponent } from './settings/settings.component';
import { SignupComponent } from './signup/signup.component';
import { SupportViewerComponent } from './support/shared/support-viewer/support-viewer.component';
import { SupportHomeComponent } from './support/support-home/support-home.component';
import { TestpageComponent } from './testpage/testpage.component';
import { TipsComponent } from './tips/tips.component';
import { TodoArchivedComponent, TodoDashboardComponent, TodoHomeComponent, TodoProjectComponent } from './todo';
import { TodoDashboardNewComponent } from './todo/todo-dashboard-new/todo-dashboard-new.component';
import { TodoOutletComponent } from './todo/todo-outlet/todo-outlet.component';
import { UserViewerComponent } from './user-viewer/user-viewer.component';


const SUPPORT_ROUTES: Route[] = [
  { path: 'home', component: SupportHomeComponent },
  { path: ':id', component: SupportViewerComponent }
];

const redirectUnauthorizedToLogin = redirectUnauthorizedTo(['login']);

// The routes
export const AppRoutes: Route[] = [
  // About StudyBuddy
  { path: 'about', component: AboutComponent },
  // Account
  { path: 'account', component: AccountComponent, ...canActivate(redirectUnauthorizedToLogin) },
  // Chatrooms! Coming soon.
  { path: 'chats', component: ChatsComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'chats/explore', component: ChatExploreComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'chats/:id', component: ChatViewerComponent, ...canActivate(redirectUnauthorizedToLogin) },
  // Cheat sheet page
  { path: 'cheatsheets', component: CheatsheetHomeComponent },
  { path: 'cheatsheets/:id', component: CheatsheetViewerComponent },
  // Dashboard
  { path: 'dashboard', component: DashboardComponent, ...canActivate(redirectUnauthorizedToLogin) },
  // Downloads for the app. Currently a bit empty
  { path: 'downloads', component: AppDownloadsComponent },
  // Login page
  { path: 'login', component: LoginComponent },
  // Notes
  { path: 'notes', component: NotesHomeComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'notes/note-not-found', component: NoteNotFoundComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'notes/:id', component: NotesViewerComponent, ...canActivate(redirectUnauthorizedToLogin) },
  // Reroutes those going to the old route to the new 'tips' route
  // Note: This **may** be removed in a future release
  { path: 'resources', redirectTo: '/tips' },
  // Settings page. Currently a bit broken
  { path: 'settings', component: SettingsComponent, ...canActivate(redirectUnauthorizedToLogin) },
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
    path: 'todo', component: TodoOutletComponent, ...canActivate(redirectUnauthorizedToLogin), children: [
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
  { path: 'user/:userId', component: UserViewerComponent },
  { path: 'u/:userId', component: UserViewerComponent },
  { path: '**', redirectTo: '/dashboard' }
];

// The routing
export const AppRouting: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
