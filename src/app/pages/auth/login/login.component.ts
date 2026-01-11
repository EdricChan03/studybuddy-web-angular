import { Component, OnDestroy } from '@angular/core';
import { Auth, user as currentUser } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { AuthService } from '@app/auth.service';
import { DialogsService } from '@app/core/dialogs/dialogs.service';
import { SharedService } from '@app/shared.service';
import { ToolbarService } from '@app/toolbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  showLoginFormPassword = false;
  redirectUrl = '/dashboard';

  constructor(
    private coreDialogs: DialogsService,
    private shared: SharedService,
    fb: FormBuilder,
    afAuth: Auth,
    private auth: AuthService,
    route: ActivatedRoute,
    private router: Router,
    private toolbar: ToolbarService
  ) {
    shared.title = 'Login';
    this.loginForm = fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required]
    });
    this.toolbar.showToolbar = false;

    // Redirect URL logic
    route.queryParams.pipe(
      map(params => decodeURIComponent(params['redirectUrl']))
    ).subscribe(redirectUrl => {
      console.log('URL to redirect to after login:', redirectUrl);
      this.redirectUrl = redirectUrl;
    });

    currentUser(afAuth).subscribe(user => {
      if (user !== null) {
        // Redirect to `redirectUrl`
        console.log(`User is logged-in. Redirecting to ${this.redirectUrl}...`);
        this.router.navigateByUrl(this.redirectUrl);
      }
    });
  }

  ngOnDestroy() {
    this.toolbar.showToolbar = true;
  }

  resetPassword() {
    const dialogRef = this.coreDialogs.openPromptDialog({
      title: 'Reset password',
      msg: 'Enter the email address to reset below:',
      inputConfig: {
        inputType: 'email',
        label: 'Email address'
      },
      positiveBtnText: 'Reset',
      positiveBtnColor: 'warn'
    });
    dialogRef.afterClosed().subscribe(result => {
      // Note: The dialog's result will return `undefined` if the user clicked
      // outside of the dialog
      if (result !== undefined) {
        this.auth.resetPassword(result).then(_ => {
          this.shared.openSnackBar({
            msg: 'Your password has successfully been reset! An email will shortly be sent your way to update your password.',
            additionalOpts: { duration: 6000 }
          });
        }).catch(error => {
          this.shared.openSnackBar({ msg: `Error: ${error.message}` });
        });
      } else {
        console.log('User clicked cancel!');
      }
    });
  }

  loginWithGoogle() {
    this.auth.logInWithGoogle().then((result) => {
      this.shared.openSnackBar({ msg: `Signed in as ${result.user.email}` });
    }).catch((error) => {
      this.handleError(error);
    });
  }

  loginWithEmailAndPassword() {
    this.auth.logInWithEmailAndPassword(this.loginForm.get('email').value, this.loginForm.get('password').value).then((result) => {
      this.shared.openSnackBar({ msg: `Signed in as ${result.user.email}` });
      this.router.navigateByUrl(this.redirectUrl);
    }).catch((error) => {
      this.handleError(error);
    });
  }

  private handleError(error: any) {
    console.log(error);
    this.shared.openSnackBar({ msg: `Error: ${error.message}` });
  }
}
