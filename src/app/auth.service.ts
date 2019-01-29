import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
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
    });
  }
  /**
   * A getter to check whether there is a currently authenticated user
   */
  get authenticated(): boolean {
    return this.authState !== null;
  }
  /** Returns the current instance of Firebase's Auth object */
  get firebaseAuth(): firebase.auth.Auth {
    return this.afAuth.auth;
  }
  /**
   * Attemps to log in with a username and password
   * @param email The email to login as
   * @param password The password to login as
   * @return A promise with the user's credentials
   */
  logInWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
  /**
   * Attempts to sign up with a username and password
   * @param email The email to sign up with
   * @param password The password to sign up with
   * @return A promise with the user's credentials
   */
  signUpWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }
  /**
   * Attempts to log in with Google
   * @return A promise with the user's credentials
   */
  logInWithGoogle(): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  /**
   * Logs out the current user
   * Note: Ideally, a confirmation dialog should be shown askingwhether the user wishes to log out.
   * In this case, developers have to implement their own functionality in their own apps.
   * @return The promise of the logout
   */
  logOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }
  /**
   * Gets the auth state
   * @return The obserable of the state
   */
  getAuthState(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }
  /**
   * Checks if the user has been logged in
   * Note: Ideally, this should be used once Angular has loaded the component's view.
   * Note: Consider using {@link AuthService#getAuthState} instead.
   * @return `true` if there is a logged-in user, `false` otherwise
   */
  isLoggedIn(): boolean {
    return this.afAuth.auth.currentUser !== null;
  }
  /**
   * Resets the password of an account
   * @param email The email to reset the password
   * @return A promise
   */
  resetPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
