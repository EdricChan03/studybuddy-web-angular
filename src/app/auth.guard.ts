import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

import { environment } from '../environments/environment';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return environment.disableRouterAuth || user(auth).pipe(
    take(1),
    map(user => !!user),
    map(loggedIn => !loggedIn ? router.createUrlTree(['/login'], {queryParams: {redirectUrl: state.url}}) : loggedIn)
  );
};
