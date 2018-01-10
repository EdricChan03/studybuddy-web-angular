import { SharedService } from './shared.service';
import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {
	constructor(private shared: SharedService, private afAuth: AngularFireAuth) {
		this.user = afAuth.authState;
		this.afAuth.auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(user);
				this.isSignedIn = true;
			} else {
				this.isSignedIn = false;
			}
		});
		if (!this.shared.isOnline) {
			// tslint:disable-next-line:max-line-length
			const snackBarRef = this.shared.openSnackBar({ msg: 'You are offline. Some actions will not be available.', action: 'Retry', additionalOpts: { panelClass: 'mat-elevation-z3', horizontalPosition: 'start' } });
			snackBarRef.onAction().subscribe(() => {
				window.location.reload(true);
			});
		}
	}
	get isMobile() {
		return this.shared.isMobile;
	}
	@ViewChild('left') sidenav: MatSidenav;
	user: Observable<firebase.User>;
	currentUser: any;
	sidenavLinks = [
		{
			link: 'todo',
			title: 'Todos',
			icon: 'check_circle'
		},
		{
			link: 'downloads',
			title: 'App Downloads',
			icon: 'apps'
		},
		{
			link: 'resources',
			title: 'Resources',
			icon: 'book'
		}
	];
	otherLinks = [
		{
			link: 'settings',
			title: 'Settings',
			icon: 'settings'
		},
		{
			link: 'about',
			title: 'About',
			icon: 'info'
		}
	];
	isSignedIn = false;
	get isSidenavOpened(): boolean {
		return this.sidenav.opened;
	}
	signOut() {
		this.afAuth.auth.signOut().then((res) => {
			// tslint:disable-next-line:max-line-length
			const snackbarRef = this.shared.openSnackBar({ msg: 'Signed out', action: 'Undo', additionalOpts: { duration: 4000, horizontalPosition: 'start' } });
			snackbarRef.onAction().subscribe(() => {
				this.signIn();
			});
			console.log(res);
		}, (err) => {
			this.shared.openSnackBar({ msg: `Error: ${err.message}`, additionalOpts: { duration: 4000, horizontalPosition: 'start' } });
		});
	}
	signIn() {
		this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((a) => {
			this.shared.openSnackBar({ msg: `Signed in as ${a.user.email}`, additionalOpts: { duration: 4000, horizontalPosition: 'start' } });
		}, err => {
			this.shared.openSnackBar({ msg: `Error: ${err.message}`, additionalOpts: { duration: 4000, horizontalPosition: 'start' } });
		});
	}
	about() {
		this.shared.openAlertDialog({ msg: 'Did you know that this dialog was made using a shared function? Check out the code for more info!' });
	}
}
