import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { AppDownloadsComponent } from './appdownloads/appdownloads.component';
import { ChatExploreComponent } from './chats/chat-explore/chat-explore.component';
import { ChatViewerComponent } from './chats/chat-viewer/chat-viewer.component';
import { ChatsComponent } from './chats/chats.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TipsComponent } from './tips/tips.component';
import { TodoArchivedComponent, TodoDashboardComponent, TodoHomeComponent, TodoProjectComponent } from './todo';
import { TodoOutletComponent } from './todo/todo-outlet/todo-outlet.component';
import { UserViewerComponent } from './user-viewer/user-viewer.component';
import { DevelopmentGuard } from './development.guard';

const redirectUnauthorizedToLogin = redirectUnauthorizedTo(['login']);

// The routes
const routes: Route[] = [
  // About StudyBuddy
  { path: 'about', component: AboutComponent },
  // Account
  { path: 'account', redirectTo: '/settings/account' },
  // Chatrooms! Coming soon.
  { path: 'chats', component: ChatsComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'chats/explore', component: ChatExploreComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'chats/:id', component: ChatViewerComponent, ...canActivate(redirectUnauthorizedToLogin) },
  // Dashboard
  { path: 'dashboard', component: DashboardComponent, ...canActivate(redirectUnauthorizedToLogin) },
  // Downloads for the app. Currently a bit empty
  { path: 'downloads', component: AppDownloadsComponent },
  // Login page
  { path: 'login', component: LoginComponent },
  // Sign up page
  { path: 'signup', component: SignupComponent },
  // An alias for signing up
  { path: 'sign-up', redirectTo: '/signup' },
  // Test links for developers.
  { path: 'test', redirectTo: '/develop/shared-service' },
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
