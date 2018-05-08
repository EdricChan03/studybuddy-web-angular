import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

// An authentication wrapper for Firebase Auth
@Injectable({
	providedIn: 'root'
})
export class AuthService {
	authState: firebase.User = null;
	constructor(
		/**
		 * Angular Fire - Firebase Authentication
		 */
		public afAuth: AngularFireAuth
	) {
		afAuth.authState.subscribe((result) => {
			this.authState = result;
		})
	}
	get authenticated(): boolean {
		return this.authState != null;
	}
	/**
	 * Attemps to log in with a username and password
	 * @param email The email to login as
	 * @param password The password to login as
	 */
	logInWithEmailAndPassword(email: string, password: string): Promise<any> {
		return this.afAuth.auth.signInWithEmailAndPassword(email, password);
	}
	/**
	 * Attempts to sign up with a username and password
	 * @param email The email to sign up with
	 * @param password The password to sign up with
	 */
	signUpWithEmailAndPassword(email: string, password: string): Promise<any> {
		return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
	}
	/**
	 * Attempts to log in with Google
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
