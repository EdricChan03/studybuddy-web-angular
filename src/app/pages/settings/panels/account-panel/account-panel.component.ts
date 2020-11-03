import { Component, TemplateRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';

import { SharedService } from '@app/shared.service';
import { UserInfoDialogComponent } from '@app/dialogs';
import { DialogsService } from '@app/core/dialogs/dialogs.service';
import { DialogResult } from '@app/core/dialogs/models';

@Component({
  selector: 'app-account-panel',
  templateUrl: './account-panel.component.html'
})
export class AccountPanelComponent {
  user: firebase.User;
  user$: Observable<firebase.User>;
  constructor(
    private afAuth: AngularFireAuth,
    private coreDialogs: DialogsService,
    private dialog: MatDialog,
    public shared: SharedService
  ) {
    this.user$ = afAuth.user;
    afAuth.user.subscribe(user => this.user = user);
  }

  openOfflineDialog(reason?: string) {
    this.coreDialogs.openAlertDialog({
      title: 'Internet connection required',
      msg: reason ? `An internet connection is required to ${reason}.` : 'You need an internet connection to continue.'
    });
  }

  signOutAccount() {
    this.afAuth.signOut().then(() => {
      this.shared.openSnackBar({
        msg: 'You have successfully signed out of your account.'
      });
    });
  }

  confirmSignOutAccount() {
    if (!this.shared.isOnline) {
      this.openOfflineDialog('sign out of your account');
    } else {
      const confirmDialogRef = this.coreDialogs.openConfirmDialog({
        msg: 'Sign out?',
        positiveBtnColor: 'warn'
      });
      confirmDialogRef.afterClosed().subscribe(result => {
        if (result === DialogResult.POSITIVE) {
          this.signOutAccount();
        }
      });
    }
  }

  deleteAccount(user: firebase.User) {
    user.delete().then(() => {
      console.log('Successfully deleted account!');
      this.shared.openSnackBar({
        msg: 'Your account has successfully been deleted.'
      });
    }, (error: firebase.FirebaseError) => {
      console.error('Could not delete account:', error);
      if (error.code === 'auth/requires-recent-login') {
        const snackBarRef = this.shared.openSnackBar({
          msg: 'Deleting your account requires you to re-sign in first. Please re-sign in.',
          action: 'Resign-in',
          config: {
            duration: 10000
          }
        });
        // TODO
        // snackBarRef.onAction().subscribe(() => {
        // })
      }
      this.shared.openSnackBar({
        msg: 'Your account could not be deleted. Try again later.'
      });
    });
  }

  confirmDeleteAccount(user: firebase.User, skipConfirm: boolean = false) {
    if (!this.shared.isOnline) {
      this.openOfflineDialog('delete your account');
    } else {
      if (!skipConfirm) {
        const confirmDialogRef = this.coreDialogs.openConfirmDialog({
          title: 'Delete account?',
          msg: 'This cannot be undone!',
          positiveBtnColor: 'warn',
          positiveBtnText: 'Delete'
        });
        confirmDialogRef.afterClosed().subscribe(result => {
          if (result === DialogResult.POSITIVE) {
            this.deleteAccount(user);
          }
        });
      } else {
        this.deleteAccount(user);
      }
    }
  }

  openUserInfoDialog() {
    this.dialog.open(UserInfoDialogComponent);
  }

  openDialog(templateRef: TemplateRef<any>, needsOnline: boolean = false, offlineReason?: string) {
    if ((needsOnline && this.shared.isOnline) || !needsOnline) {
      this.dialog.open(templateRef);
    } else {
      this.openOfflineDialog(offlineReason);
    }
  }

  openUpdateAccountInputDialog(updateType: 'name' | 'email' | 'password') {
    if (!this.shared.isOnline) {
      this.openOfflineDialog('update your account details');
    } else {
      let inputType = 'text';
      switch (updateType) {
        case 'email':
          inputType = 'email';
          break;
        case 'password':
          inputType = 'password';
      }

      const promptDialogRef = this.coreDialogs.openPromptDialog({
        title: `Update ${updateType}`,
        inputConfig: {
          label: `New ${updateType}`,
          inputType
        }
      });
      promptDialogRef.afterClosed().subscribe(result => {
        if (result !== DialogResult.CANCEL) {
          switch (updateType) {
            case 'email':
              this.user.updateEmail(result).then(() => {
                this.shared.openSnackBar({
                  msg: 'Your email address has successfully been updated.'
                });
              }, error => {
                console.error('Could not update email address:', error);
                this.shared.openSnackBar({
                  msg: 'An error occurred while attempting to update your email address. Please try again later.',
                  config: {
                    duration: 10000
                  }
                });
              });
              break;
            case 'name':
              this.user.updateProfile({ displayName: result }).then(() => {
                this.shared.openSnackBar({
                  msg: 'Your name has successfully been updated.'
                });
              }, error => {
                console.error('Could not update display name:', error);
                this.shared.openSnackBar({
                  msg: 'An error occurred while attempting to update your name. Please try again later.',
                  config: {
                    duration: 10000
                  }
                });
              });
              break;
            case 'password':
              this.user.updatePassword(result).then(() => {
                this.shared.openSnackBar({
                  msg: 'Your password has successfully been updated.'
                });
              }, error => {
                console.error('Could not update password:', error);
                this.shared.openSnackBar({
                  msg: 'An error occurred while attempting to update your password. Please try again later.',
                  config: {
                    duration: 10000
                  }
                });
              });
              break;
          }
        }
      });
    }
  }

  getUserFriendlyBoolean(val: boolean): string {
    return val ? 'Yes' : 'No';
  }
}
