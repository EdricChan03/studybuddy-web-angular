import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AppDownloadsComponent } from './appdownloads/appdownloads.component';
import { ChatExploreComponent } from './chats/chat-explore/chat-explore.component';
import { ChatViewerComponent } from './chats/chat-viewer/chat-viewer.component';
import { ChatsComponent } from './chats/chats.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { TipsComponent } from './tips/tips.component';
import { TodoArchivedComponent, TodoDashboardComponent, TodoHomeComponent, TodoProjectComponent } from './todo';
import { TodoOutletComponent } from './todo/todo-outlet/todo-outlet.component';
import { UserViewerComponent } from './user-viewer/user-viewer.component';

import { AuthGuard } from './auth.guard';
import { DevelopmentGuard } from './development.guard';

// The routes
const routes: Route[] = [
  // About StudyBuddy
  { path: 'about', component: AboutComponent },
  // Account
  { path: 'account', redirectTo: '/settings/account' },
  // Chatrooms! Coming soon.
  { path: 'chats', component: ChatsComponent, canActivate: [AuthGuard] },
  { path: 'chats/explore', component: ChatExploreComponent, canActivate: [AuthGuard] },
  { path: 'chats/:id', component: ChatViewerComponent, canActivate: [AuthGuard] },
  // Dashboard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  // Downloads for the app. Currently a bit empty
  { path: 'downloads', component: AppDownloadsComponent },
  // Sign up page
  { path: 'signup', component: SignupComponent },
  // An alias for signing up
  { path: 'sign-up', redirectTo: '/signup' },
  // Test links for developers.
  { path: 'test', redirectTo: '/develop/shared-service' },
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
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'quizzes',
    loadChildren: () => import('./pages/quiz/quiz.module').then(m => m.QuizModule)
  },

  // Wildcard routes
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
