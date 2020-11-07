import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@app/auth.service';
import { SharedService } from '@app/shared.service';
import { ToolbarService } from '@app/toolbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy, OnInit {
  signUpForm: FormGroup;
  showSignUpFormPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private shared: SharedService,
    private toolbar: ToolbarService,
    fb: FormBuilder
  ) {
    shared.title = 'Register';
    toolbar.showToolbar = false;
    this.signUpForm = fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.toolbar.showToolbar = true;
  }

  ngOnInit() {
    this.auth.getAuthState().subscribe(result => {
      if (result && JSON.parse(localStorage.getItem('loggedIn'))) {
        console.log('User is already logged in. Redirecting...');
        const snackBarRef = this.shared.openSnackBar(
          {
            msg: 'You\'re already logged in! Redirecting in 2 seconds...',
            action: 'Log out',
            additionalOpts:
            {
              duration: 5000
            }
          }
        );
        snackBarRef.onAction().subscribe(() => {
          this.auth.logOut().then(() => {
            this.shared.openSnackBar({
              msg: 'Successfully logged out'
            });
            this.router.navigate(['/login']);
            localStorage.setItem('loggedIn', 'false');
          });
        });
        setTimeout(() => {
          this.router.navigate(['dashboard']);
        }, 2000);
      }
    });
  }

  toggleSignUpFormPassword() {
    this.showSignUpFormPassword = !this.showSignUpFormPassword;
  }

  signUpWithGoogle() {
    this.auth.logInWithGoogle().then((result) => {
      this.shared.openSnackBar({ msg: `Signed in as ${result.user.email}` });
      localStorage.setItem('loggedIn', 'true');
    }).catch((error) => {
      this.handleError(error.message);
    });
  }

  signUpWithEmailAndPassword() {
    this.auth.signUpWithEmailAndPassword(this.signUpForm.get('email').value, this.signUpForm.get('password').value).then((result) => {
      this.shared.openSnackBar({ msg: `Successfully created account as ${result.user.email}` });
    }).catch((error) => {
      this.handleError(error.message);
    });
  }

  private handleError(errorMsg: string) {
    this.shared.openSnackBar({ msg: `Error: ${errorMsg}` });
  }
}
