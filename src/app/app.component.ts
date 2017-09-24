import { Shared } from './shared';
import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {
	user: Observable<firebase.User>;
	constructor(private shared: Shared, private afAuth: AngularFireAuth) {
		this.user = afAuth.authState;
		this.afAuth.auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(user);
				this.isSignedIn = true;
			} else {
				this.isSignedIn = false;
			}
		})
	}
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
		}
	]
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
	]
	isSignedIn = false;
	signOut() {
		this.afAuth.auth.signOut().then((res) => {
			// this.shared.openSnackBar(res);
			let snackbarRef = this.shared.openActionSnackBar({ msg: "Signed in with Google", action: "Sign out", additionalOpts: { duration: 4000 } });
			snackbarRef.subscribe(_ => {
				this.signIn();
			})
			console.log(res);
		}, (err) => {
			this.shared.openSnackBar({ msg: `Error: ${err.message}`, additionalOpts: { duration: 4000 } });
		});
	}
	signIn() {
		this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((a) => {
			console.log(a);
			// this.shared.openSnackBar(a);
		}, err => {
			this.shared.openSnackBar({ msg: `Error: ${err.message}`, additionalOpts: { duration: 4000 } });
		})
	}
	about() {
		this.shared.openAlertDialog({ msg: "Did you know that this dialog was made using a shared function? Check out the code for more info!" });
	}
}
