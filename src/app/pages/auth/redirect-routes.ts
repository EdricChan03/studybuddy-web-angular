import { Routes } from '@angular/router';

// Root redirect routes
export const redirectRoutes: Routes = [
  { path: 'login', redirectTo: '/auth/login' },
  { path: 'signup', redirectTo: '/auth/register' },
  { path: 'sign-up', redirectTo: '/auth/register' },
  { path: 'forgot-password', redirectTo: '/auth/reset-password' },
  { path: 'reset-password', redirectTo: '/auth/reset-password' }
];
