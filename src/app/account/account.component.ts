import { Component } from '@angular/core';
import { SharedService } from '../shared.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent {

  user: firebase.User;
  isSignedIn = false;
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
    const dialogRef = this.shared.openConfirmDialog({
      title: 'Log out?',
      msg: 'Changes not saved will be lost.',
      ok: 'Log out',
      okColor: 'warn'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.authService.logOut().then((res) => {
          const snackbarRef = this.shared.openSnackBar({
            msg: 'Signed out',
            action: 'Undo'
          });
          snackbarRef.onAction().subscribe(() => {
            this.newSignIn('google');
          });
          console.log(res);
        })
          .catch((error) => {
            this.handleError(error.message);
          });
      }
    });
  }
  /**
   * Signs in with Google
   */
  signInWithGoogle() {
    this.authService.logInWithGoogle().then((result) => {
      this.shared.openSnackBar({ msg: `Signed in as ${result.user.email}` });
    }).catch((error) => {
      this.handleError(error.message);
    });
  }
  /**
   * Uses new sign in
   * @param authType The authentication type (optional, assumes default method is Google)
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
  deleteData() {
    this.shared.openConfirmDialog({
      title: 'Delete data?',
      msg: 'Once deleted, all data will be lost!'
    }).afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.shared.openSnackBar({
          msg: 'We\'re currently deleting your data. This may take a while.',
          additionalOpts: {
            duration: null
          }
        });
        this.afFs.doc(`users/${this.user.uid}`)
          .delete()
          .then(() => {
            this.shared.openSnackBar({ msg: 'Data was successfully deleted' });
          })
          .catch((error) => {
            this.handleError(error.message);
          });
      }
    });
  }
  /**
   * Deletes the currently logged-in user
   */
  deleteUser() {
    const confirmDialogRef = this.shared.openConfirmDialog({
      title: 'Unregister?',
      msg: `<p>Unregistering will clear all data associated with your account.</p>
      <p><strong>Take note that if you would like to save your data, you can do so by going to Account > Export data.</strong></p>`,
      isHtml: true,
      ok: 'Unregister and delete data'
    });
    confirmDialogRef.afterClosed().subscribe(result => {
      if (result === 'ok' && this.user) {
        this.deleteData();
        this.user.delete().then(() => {
          console.log('User successfully deleted!');
          this.shared.openSnackBar({
            msg: 'Successfully unregistered!'
          });
        }).catch((error) => {
          console.error(error);
          if (error.code === 'auth/requires-recent-login') {
            const snackBarRef = this.shared.openSnackBar({
              msg: 'Please relogin before unregistering first.',
              action: 'Relogin',
              additionalOpts: { duration: 8000 }
            });
            snackBarRef.onAction().subscribe(_ => {
              // User has not logged in for a while.
              // Firebase auth needs the user to have a recent login in order for this to work.
              this.user.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => {
                this.deleteUser();
              })
                .catch((snackBarError) => {
                  console.error(snackBarError);
                  this.handleError(snackBarError.message);
                });
            });
          } else {
            this.handleError(error.message);
          }
        });
      }
    });
  }
  private handleError(errorMsg: string, logError: boolean = true) {
    if (logError) {
      // Log error to console
      console.error(errorMsg);
    }
    this.shared.openSnackBar({ msg: `Error: ${errorMsg}` });
  }

}
