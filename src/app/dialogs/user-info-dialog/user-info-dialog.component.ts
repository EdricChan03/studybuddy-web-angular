import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html'
})
export class UserInfoDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<UserInfoDialogComponent>,
    private afAuth: AngularFireAuth
  ) {
    this.userObservable = afAuth.authState;
    afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        this.isSignedIn = true;
      } else {
        // Not signed in!
        this.isSignedIn = false;
      }
    });
  }
  currentUser: firebase.User;
  userObservable: Observable<firebase.User>;
  isSignedIn: boolean;
  showJson = false;
}
