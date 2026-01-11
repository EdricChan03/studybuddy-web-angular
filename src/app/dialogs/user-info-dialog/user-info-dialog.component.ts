import { Observable } from 'rxjs';
import { Auth, user } from '@angular/fire/auth';
import { Component } from '@angular/core';
import type { User } from '@firebase/auth';

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html'
})
export class UserInfoDialogComponent {
  user$: Observable<User>;
  showJson = false;
  constructor(
    afAuth: Auth
  ) {
    this.user$ = user(afAuth);
  }
}
