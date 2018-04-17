import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

// An authentication wrapper for Firebase Auth
@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(
		/**
		 * Angular Fire - Firebase Authentication
		 */
		public afAuth: AngularFireAuth
	) { }
	/**
	 * Attempts to login with Google
	 * @returns {Promise<any>} The promise of the login
	 */
	logInWithGoogle(): Promise<any> {
		return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
	}
	/**
	 * Logs out the current user
	 * Note: Ideally, a confirmation dialog should be shown asking whether the user wishes to log out. In this case, developers have to implement their own functionality in their own apps.
	 * @returns {Promise<any>} The promise of the logout
	 */
	logOut(): Promise<any> {
		return this.afAuth.auth.signOut();
	}
	/**
	 * Gets the auth state
	 * @returns {Observable<firebase.User | null>} The obserable of the state
	 */
	getAuthState(): Observable<firebase.User | null> { 
		return this.afAuth.authState;
	}
	/**
	 * Checks if the user has been logged in
	 * Note: Ideally, this should be used once Angular has loaded the component's view.
	 * Note: Consider using {@link AuthService#getAuthState} instead.
	 * @returns {boolean} Whether there is a logged in user
	 */
	isLoggedIn(): boolean {
		return this.afAuth.auth.currentUser !== null;
	}
}
