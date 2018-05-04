import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	constructor(
		private shared: SharedService,
		private fb: FormBuilder,
		private auth: AuthService,
		private router: Router
	) {
		shared.title = 'Login';
		this.loginForm = fb.group({
			'email': ['', [Validators.required, Validators.email]],
			'password': ['', Validators.required]
		})
	}
	loginForm: FormGroup;
	showPassword: boolean = false;
	ngOnInit() {
		this.auth.getAuthState().subscribe(result => {
			if (result && JSON.parse(localStorage.getItem('loggedIn'))) {
				console.log('User is already logged in. Redirecting...');
				let snackBarRef = this.shared.openSnackBar({ msg: 'You\'re already logged in! Redirecting in 2 seconds...', action: 'Log out', hasElevation: true, additionalOpts?: { duration: 5000, horizontalPosition: 'start' } });
				snackBarRef.onAction().subscribe(result => {
					this.auth.logOut().then(() => {
						this.shared.openSnackBar({ msg: 'Successfully logged out', hasElevation: true, additionalOpts: { duration: 3000, horizontalPosition: 'start' } });
						localStorage.setItem('loggedIn', 'false');
					})
				})
				setTimeout(() => {
					this.router.navigate(['dashboard']);
				}, 2000)
			}
		})
	}
	togglePassword() {
		this.showPassword = !this.showPassword;
	}
	loginWithGoogle() {
		this.auth.logInWithGoogle().then((result) => {
			// tslint:disable-next-line:max-line-length
			this.shared.openSnackBar({ msg: `Signed in as ${result.user.email}`, hasElevation: true, additionalOpts: { duration: 4000, horizontalPosition: 'start' } });
			localStorage.setItem('loggedIn', 'true');
		}).catch((error) => {
			this.handleError(error.message);
		});
	}
	loginWithUsernameAndPassword() {
		this.auth.logInWithUsernameAndPassword(this.loginForm.get('email').value, this.loginForm.get('password').value).then((result) => {
			// tslint:disable-next-line:max-line-length
			this.shared.openSnackBar({ msg: `Signed in as ${result.user.email}`, additionalOpts: { duration: 4000, horizontalPosition: 'start', panelClass: 'mat-elevation-z3' } });
		}).catch((error) => {
			this.handleError(error.message);
		})
	}
	private handleError(errorMsg: string) {
		this.shared.openErrorSnackBar({ msg: `Error: ${errorMsg}`, hasElevation: 2, additionalOpts: { horizontalPosition: 'start', } });
	}
}
