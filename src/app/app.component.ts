import { ToolbarService } from './toolbar.service';
import { SharedService } from './shared.service';
import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationStart } from '@angular/router';
import { UserInfoDialogComponent } from './dialogs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {
	constructor(
		private shared: SharedService,
		private afAuth: AngularFireAuth,
		private toolbarService: ToolbarService,
		private router: Router,
		private afFs: AngularFirestore,
		private dialog: MatDialog
	) {
		this.userObservable = afAuth.authState;
		this.afAuth.auth.onAuthStateChanged((user) => {
			if (user) {
				this.user = user;
				console.log(user);
				this.isSignedIn = true;
			} else {
				// User is signed out! Show sign in dialog here
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
		router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				if (router.url === '/todo') {
					this.toolbarService.showToolbar = true;
				}
			}
		});
	}
	/**
	 * Checks whether the user is using a mobile device
	 */
	get isMobile() {
		return this.shared.isMobile;
	}
	/**
	 * The sidenav
	 */
	@ViewChild('left') sidenav: MatSidenav;
	environment = environment;
	user: firebase.User;
	userObservable: Observable<firebase.User>;
	/**
	 * Links for the sidenav
	 */
	sidenavLinks = [
		{
			link: 'todo/home',
			title: 'Todos',
			icon: 'check_circle'
		},
		{
			link: 'downloads',
			title: 'App Downloads',
			icon: 'apps'
		},
		{
			link: 'tips',
			title: 'Tips',
			icon: 'lightbulb_outline'
		},
		{
			link: 'chats',
			title: 'Chats',
			icon: 'chat'
		},
		{
			link: 'cheatsheets/home',
			title: 'Cheatsheets',
			icon: 'library_books'
		}
	];
	/**
	 * Other links for the sidenav
	 */
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
		},
		{
			link: 'support/home',
			title: 'Help',
			icon: 'help'
		}
	];
	/**
	 * Whether the user is signed in
	 */
	isSignedIn = false;
	/**
	 * Checks whether the sidenav is currently opened
	 * @returns {boolean}
	 */
	get isSidenavOpened(): boolean {
		return this.sidenav.opened;
	}
	openUserInfoDialog() {
		this.dialog.open(UserInfoDialogComponent);
	}
	/**
	 * Signs out the user
	 */
	signOut() {
		// tslint:disable-next-line:max-line-length
		let dialogRef = this.shared.openConfirmDialog({ title: 'Log out?', msg: 'Changes not saved will be lost.', ok: 'Log out', okColor: 'warn' });
		dialogRef.afterClosed().subscribe(result => {
			if (result === 'ok') {
				this.afAuth.auth.signOut().then((res) => {
					// tslint:disable-next-line:max-line-length
					const snackbarRef = this.shared.openSnackBar({ msg: 'Signed out', action: 'Undo', additionalOpts: { duration: 4000, horizontalPosition: 'start' } });
					snackbarRef.onAction().subscribe(() => {
						this.newSignIn('google');
					});
					console.log(res);
				}, (error) => {
					this.handleError(error.message);
				});
			}
		})
	}
	/**
	 * @deprecated Use {@link AppComponent#signInWithGoogle} instead or {@link AppComponent#newSignIn}
	 */
	signIn() {
		this.signInWithGoogle();
	}
	/**
	 * Signs in with Google
	 */
	signInWithGoogle() {
		this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
			// tslint:disable-next-line:max-line-length
			this.shared.openSnackBar({ msg: `Signed in as ${result.user.email}`, additionalOpts: { duration: 4000, horizontalPosition: 'start', panelClass: 'mat-elevation-z3' } });
		}).catch((error) => {
			this.handleError(error.message);
		});
	}
	/**
	 * Uses new sign in
	 * @param {'google'|'anonymous'|'email'} authType The authentication type (optional, assumes default method is Google)
	 */
	newSignIn(authType?: 'google' | 'anonymous' | 'email', params?: any) {
		// Checks if the authType argument is passed
		if (authType) {
			switch (authType) {
				case 'anonymous':
					this.shared.openAlertDialog({ msg: 'Anonymous login is not supported. Please use another form of authentication' });
					console.error('Anonymous login is not supported. Aborting...');
					break;
				case 'google':
					// This is already supported
					this.signInWithGoogle();
					break;
				case 'email':

				// this.afAuth.auth.signInWithEmailAndPassword()
			}
		} else {
			// Assume Google login
			this.signInWithGoogle();
		}
	}
	exportData() {
		// tslint:disable-next-line:max-line-length
		this.shared.openAlertDialog({ title: 'Export data', msg: '<p>Unfortunately, there\'s currently no such support for exporting/ importing data from/ to the database.</p><p>You should probably keep a physical copy of your notes somewhere! :)</p>', isHtml: true, ok: 'Dismiss' });
	}
	deleteUser() {
		// tslint:disable-next-line:max-line-length
		let confirmDialogRef = this.shared.openConfirmDialog({ title: 'Unregister?', msg: '<p>Unregistering will clear all data associated with your account.</p><p><strong>Take note that if you would like to save your data, you can do so by going to Account > Export data.</strong></p>', isHtml: true, ok: 'Unregister and delete data' });
		confirmDialogRef.afterClosed().subscribe(result => {
			if (result === 'ok') {
				// tslint:disable-next-line:max-line-length
				let doubleConfirmDialogRef = this.shared.openConfirmDialog({ title: 'Really unregister?', msg: 'If you did not export your data, all of your data will be deleted! Continue?', ok: 'Unregister and delete data', okColor: 'warn', hasCheckbox: true, checkboxLabel: 'I confirm that I have backed up all data and that deleting my account will remove all data associated with my account.', checkboxColor: 'primary', dialogRequiresCheckbox: true });
				doubleConfirmDialogRef.afterClosed().subscribe(result2 => {
					console.log(result2);
					console.log(this.user);
					if (result2 === 'ok' && this.user) {
						this.afFs.doc(`users/${this.user.uid}`)
							.delete()
							.then(() => {
								console.log('Data successfully deleted!');
							})
							.catch((error) => {
								this.handleError(error.message);
							});
						this.user.delete().then(() => {
							console.log('User successfully deleted!');
							// tslint:disable-next-line:max-line-length
							this.shared.openSnackBar({ msg: 'User successfully deleted from database', additionalOpts: { duration: 4000, panelClass: 'mat-elevation-z3', horizontalPosition: 'start' } });
						}).catch((error) => {
							console.error(error);
							if (error === 'auth/requires-recent-login') {
								// User has logged in for a while. Firebase needs the user to have a recent login in order for this to work.
								this.user.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => {
									this.deleteUser();
								})
									.catch((error2) => {
										console.error(error2);
										this.handleError(error2.message);
									});
							}
							this.handleError(error.message);
						});
					}
				});
			}
		});
	}
	private handleError(errorMsg: string) {
		// tslint:disable-next-line:max-line-length
		this.shared.openSnackBar({ msg: `Error: ${errorMsg}`, additionalOpts: { duration: 4000, panelClass: 'mat-elevation-z3', horizontalPosition: 'start' } });
	}
	about() {
		this.shared.openAlertDialog({ msg: 'Did you know that this dialog was made using a shared function? Check out the code for more info!' });
	}
}
