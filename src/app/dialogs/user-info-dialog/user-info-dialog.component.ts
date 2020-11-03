import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component } from '@angular/core';
import firebase from 'firebase/app';

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html'
})
export class UserInfoDialogComponent {
  user$: Observable<firebase.User>;
  showJson = false;
  constructor(
    afAuth: AngularFireAuth
  ) {
    this.user$ = afAuth.user;
  }
}
