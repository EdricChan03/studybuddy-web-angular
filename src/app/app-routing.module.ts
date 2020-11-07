import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AppDownloadsComponent } from './appdownloads/appdownloads.component';
import { ChatExploreComponent } from './chats/chat-explore/chat-explore.component';
import { ChatViewerComponent } from './chats/chat-viewer/chat-viewer.component';
import { ChatsComponent } from './chats/chats.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TipsComponent } from './tips/tips.component';
import { TodoArchivedComponent, TodoDashboardComponent, TodoHomeComponent, TodoProjectComponent } from './todo';
import { TodoOutletComponent } from './todo/todo-outlet/todo-outlet.component';
import { UserViewerComponent } from './user-viewer/user-viewer.component';

import { redirectRoutes as authRedirectRoutes } from './pages/auth/redirect-routes';

import { AuthGuard } from './auth.guard';
import { DevelopmentGuard } from './development.guard';

// Redirect routes
const redirectRoutes: Route[] = [
  { path: 'account', redirectTo: '/settings/account' },
  { path: 'test', redirectTo: '/develop/shared-service' },
  ...authRedirectRoutes
];

// The routes
const routes: Route[] = [
  // About StudyBuddy
  { path: 'about', component: AboutComponent },
  // Chatrooms! Coming soon.
  { path: 'chats', component: ChatsComponent, canActivate: [AuthGuard] },
  { path: 'chats/explore', component: ChatExploreComponent, canActivate: [AuthGuard] },
  { path: 'chats/:id', component: ChatViewerComponent, canActivate: [AuthGuard] },
  // Dashboard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  // Downloads for the app. Currently a bit empty
  { path: 'downloads', component: AppDownloadsComponent },
  // Tips page.
  { path: 'tips', component: TipsComponent },
  {
    path: 'todo', component: TodoOutletComponent, canActivate: [AuthGuard], children: [
      // All todos
      { path: 'home', component: TodoHomeComponent },
      // Not working as of now
      { path: 'archived', component: TodoArchivedComponent },
      // Experimental, currently WIP
      { path: 'project/:projectId', component: TodoProjectComponent },
      { path: 'dashboard', component: TodoDashboardComponent },
      { path: '**', redirectTo: '/todo/dashboard' }
    ]
  },
  { path: 'user/:userId', component: UserViewerComponent },
  { path: 'u/:userId', component: UserViewerComponent },

  // Lazy loaded feature modules
  {
    path: 'develop',
    canActivate: [DevelopmentGuard],
    loadChildren: () => import('./pages/develop/develop.module').then(m => m.DevelopModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule)
  },

  ...redirectRoutes,

  // Wildcard routes
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
