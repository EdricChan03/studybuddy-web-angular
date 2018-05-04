import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SharedService } from './shared.service';

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
	canActivate(): boolean {
		if (this.auth.isLoggedIn()) {
			return true;
		} else {
			this.shared.openSnackBar({ msg: 'Please login before accessing the page', hasElevation: true, additionalOpts: { horizontalPosition: 'start', duration: 5000 } });
			this.router.navigate(['login']);
			return false;
		}
	}
	
}
