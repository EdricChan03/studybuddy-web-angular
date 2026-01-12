import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  UserCredential,
  user,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  authState,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User = null;

  constructor(public afAuth: Auth) {
    user(afAuth).subscribe((user) => {
      this.user = user;
    });
  }

  /** Checks whether the user is authenticated. */
  get authenticated(): Observable<boolean> {
    return user(this.afAuth).pipe(map((user) => user !== null));
  }

  /**
   * Attemps to log in with a username and password
   * @param email The email to login as
   * @param password The password to login as
   * @return A promise with the user's credentials
   */
  logInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.afAuth, email, password);
  }

  /**
   * Attempts to sign up with a username and password
   * @param email The email to sign up with
   * @param password The password to sign up with
   * @return A promise with the user's credentials
   */
  signUpWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.afAuth, email, password);
  }

  /**
   * Attempts to log in with Google
   * @return A promise with the user's credentials
   */
  logInWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(this.afAuth, new GoogleAuthProvider());
  }

  /**
   * Logs out the current user
   * Note: Ideally, a confirmation dialog should be shown askingwhether the user wishes to log out.
   * In this case, developers have to implement their own functionality in their own apps.
   * @return The promise of the logout
   */
  logOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  /**
   * Gets the auth state
   * @return The obserable of the state
   */
  getAuthState(): Observable<User | null> {
    return authState(this.afAuth);
  }

  /**
   * Checks if the user has been logged in
   * Note: Ideally, this should be used once Angular has loaded the component's view.
   * Note: Consider using {@link AuthService#getAuthState} instead.
   * @return `true` if there is a logged-in user, `false` otherwise
   */
  async isLoggedIn(): Promise<boolean> {
    return this.afAuth.currentUser !== null;
  }

  /**
   * Resets the password of an account
   * @param email The email to reset the password
   * @return A promise
   */
  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.afAuth, email);
  }
}
