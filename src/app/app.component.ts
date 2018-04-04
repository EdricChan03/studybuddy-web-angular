import * as firebase from 'firebase';

import { Component, ViewChild } from '@angular/core';
import { Message, MessageImportance, MessagingService } from './messaging.service';
import { NavigationStart, Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs/Observable';
import { SharedService } from './shared.service';
import { ToolbarService } from './toolbar.service';
import { UserInfoDialogComponent } from './dialogs';
import { environment } from '../environments/environment';

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
		private dialog: MatDialog,
		private messagingService: MessagingService
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
	get messages(): Message[] {
		return this.messagingService.messages;
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
	todayDate = new Date();
	/**
	 * Links for the sidenav
	 */
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
			link: 'cheatsheets',
			title: 'Cheatsheets',
			icon: 'library_books'
		},
		{
			link: 'notes',
			title: 'Notes',
			icon: 'subject'
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
	tempId = 0;
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
	closeLeftSidenav(ref: MatSidenav) {
		if (this.shared.settings.closeSidenavOnClick) {
			ref.close();
		}
	}
	toggleNotificationSettings() {

	}
	addDebugMessage() {
		if (environment.production) {
			console.error('Please run this app in developer mode for this method to function. Aborting..');
		} else {
			this.tempId++;
			let random = Math.floor((Math.random() * 5) + 1);
			switch (random) {
				case 1:
					this.messagingService.addMessage({ category: 'Product announcements', title: 'Check out the all new XX feature which is available starting today!', date: this.todayDate, id: `debug-${this.tempId}`, importanceLevel: MessageImportance.Low, actions: [{ title: 'Read blogpost', onClickListener: (ev) => { window.location.href = 'https://example.com' } }] });
					break;
				case 2:
					this.messagingService.addMessage({ category: 'Critical alert', title: 'Feature xx is currently down. Please stand by for more updates.', date: this.todayDate, id: `debug-${this.tempId}`, importanceLevel: MessageImportance.Critical, actions: [{ title: 'Dismiss', onClickListener: (ev) => { window.location.href = 'https://example.com' } }] });
					break;
				case 3:
					this.messagingService.addMessage({ category: 'Notification', title: 'Hi there!', date: this.todayDate, id: `debug-${this.tempId}`, importanceLevel: MessageImportance.Low, actions: [{ title: 'Dismiss', onClickListener: (ev) => { window.location.href = 'https://example.com' } }] });
					break;
				case 4:
					this.messagingService.addMessage({ category: 'Newsletter', title: 'This week\'s newsletter', date: this.todayDate, id: `debug-${this.tempId}`, importanceLevel: MessageImportance.Medium, actions: [{ title: 'Dismiss', onClickListener: (ev) => { window.location.href = 'https://example.com' } }] });
					break;
				case 5:
					this.messagingService.addMessage({ category: 'Critical alert', title: 'Update: All features are back up!', date: this.todayDate, id: `debug-${this.tempId}`, importanceLevel: MessageImportance.Critical, actions: [{ title: 'Dismiss', onClickListener: (ev) => { window.location.href = 'https://example.com' } }] });
					break;
				default:
					break;
			}
		}
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
	deleteData() {
		this.afFs.doc(`users/${this.user.uid}`)
			.delete()
			.then(() => {
				console.log('Data successfully deleted!');
			})
			.catch((error) => {
				this.handleError(error.message);
			});
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
						this.deleteData();
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
		this.shared.openErrorSnackBar(errorMsg, null);
	}
}
