import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { SharedService } from './shared.service';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    public auth: AuthService,
    private shared: SharedService,
    private router: Router
  ) { }
  /**
   * Whether the route can be enabled
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.auth.afAuth.user.pipe(
      take(1),
      map(user => !!user),
      tap((loggedIn: boolean) => {
        if (!loggedIn) {
          this.shared.openSnackBar({ msg: 'Please login before accessing this page' });
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
