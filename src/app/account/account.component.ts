import { Component } from '@angular/core';
import { SharedService } from '../shared.service';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { AuthService } from '../auth.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html'
})
export class AccountComponent {

	user: firebase.User;
	isSignedIn: boolean = false;
	constructor(
		private shared: SharedService,
		private authService: AuthService,
		private afFs: AngularFirestore
	) {
		shared.title = 'Account';
		this.authService.getAuthState().subscribe((user) => {
			if (user) {
				this.user = user;
				console.log(user);
				this.isSignedIn = true;
			} else {
				// User is signed out! Show sign in dialog here
				this.isSignedIn = false;

			}
		});
	}
	signOut() {
		// tslint:disable-next-line:max-line-length
		let dialogRef = this.shared.openConfirmDialog({ title: 'Log out?', msg: 'Changes not saved will be lost.', ok: 'Log out', okColor: 'warn' });
		dialogRef.afterClosed().subscribe(result => {
			if (result === 'ok') {
				this.authService.logOut().then((res) => {
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
	 * Signs in with Google
	 */
	signInWithGoogle() {
		this.authService.logInWithGoogle().then((result) => {
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
	deleteData() {
		this.shared.openConfirmDialog({ title: 'Delete data?', msg: 'Once deleted, the data cannot be retrieved again!' }).afterClosed().subscribe(result => {
			if (result == 'ok') {
				this.shared.openSnackBar({ msg: 'We\'re currently deleting your data. Hold up tight! This may take a while.', additionalOpts: { horizontalPosition: 'start'}});
				this.afFs.doc(`users/${this.user.uid}`)
					.delete()
					.then(() => {
						this.shared.openSnackBar({ msg: 'Data was successfully deleted', additionalOpts: { duration: 4000, horizontalPosition: 'start' } });
					})
					.catch((error) => {
						this.handleError(error.message);
					});
			}
		})
	}
	/**
	 * Deletes the currently logged-in user
	 * @param {boolean} [bypassUnregisterDialog] Whether to skip the unregister confirmation dialog
	 */
	deleteUser(bypassUnregisterDialog?: boolean) {
		if (!bypassUnregisterDialog) {
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
							this.deleteData();
							this.user.delete().then(() => {
								console.log('User successfully deleted!');
								// tslint:disable-next-line:max-line-length
								this.shared.openSnackBar({ msg: 'User successfully deleted from database', additionalOpts: { duration: 4000, panelClass: 'mat-elevation-z3', horizontalPosition: 'start' } });
							}).catch((error) => {
								if (error === 'auth/requires-recent-login') {
									// User has logged in for a while and hasn't reauthenticated. Firebase needs the user to be recently logged in in order for this to work.
									this.user.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => {
										// Attempt deletion again and bypass the confirm dialog
										this.deleteUser(true);
									})
										.catch((error2) => {
											this.handleError(error2.message);
										});
								}
								this.handleError(error.message);
							});
						}
					});
				}
			});
		} else {
			this.deleteData();
			this.user.delete().then(() => {
				console.log('User successfully deleted!');
				// tslint:disable-next-line:max-line-length
				this.shared.openSnackBar({ msg: 'User successfully deleted from database', additionalOpts: { duration: 4000, panelClass: 'mat-elevation-z3', horizontalPosition: 'start' } });
			}).catch((error) => {
				if (error === 'auth/requires-recent-login') {
					// User has logged in for a while and hasn't reauthenticated. Firebase needs the user to be recently logged in in order for this to work.
					this.user.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => {
						// Attempt deletion again and bypass the confirmation dialog
						this.deleteUser(true);
					})
						.catch((error2) => {
							this.handleError(error2.message);
						});
				}
				this.handleError(error.message);
			});
		}
	}
	private handleError(errorMsg: string, logError: boolean = true) {
		if (logError) {
			// Log error to console
			console.error(errorMsg);
		}
		this.shared.openErrorSnackBar({ msg: `Error: ${errorMsg}`, hasElevation: 2, additionalOpts: { horizontalPosition: 'start' } });
	}

}
