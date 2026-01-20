import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private afAuth: Auth, private router: Router) { }

  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return environment.disableRouterAuth || user(this.afAuth).pipe(
      take(1),
      map(user => !!user),
      map(loggedIn => !loggedIn ? this.router.createUrlTree(['/login'], { queryParams: { redirectUrl: state.url } }) : loggedIn)
    );
  }
}
