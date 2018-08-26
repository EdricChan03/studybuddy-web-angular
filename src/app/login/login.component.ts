import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private shared: SharedService,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    shared.title = 'Login';
    this.loginForm = fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required]
    });
    this.signUpForm = fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirmPassword') });
  }
  loginForm: FormGroup;
  signUpForm: FormGroup;
  showLoginFormPassword = false;
  showSignUpFormPassword = false;
  showSignUpFormConfirmPassword = false;
  // See https://stackoverflow.com/a/34582914
  matchingPasswords = (passwordKey: string, confirmPasswordKey: string) => {
    return (group: FormGroup): void => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ 'mismatchedPasswords': true });
      }
    };
  }
  ngOnInit() {
    this.auth.getAuthState().subscribe(result => {
      if (result && JSON.parse(localStorage.getItem('loggedIn'))) {
        console.log('User is already logged in. Redirecting...');
        const snackBarRef = this.shared.openSnackBar({
            msg: 'You\'re already logged in! Redirecting in 2 seconds...',
            action: 'Log out',
            additionalOpts: { duration: 5000 }
          });
        snackBarRef.onAction().subscribe(() => {
          this.auth.logOut().then(() => {
            this.shared.openSnackBar({ msg: 'Successfully logged out!' });
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
  // Used for toggling the state of the visibility icon in the password input
  toggleLoginFormPassword() {
    this.showLoginFormPassword = !this.showLoginFormPassword;
  }
  resetPassword() {
    const dialogRef = this.shared.openPromptDialog(
      {
        title: 'Reset password',
        msg: 'Enter the email address to reset below:',
        placeholder: 'Email address',
        ok: 'Reset',
        okColor: 'warn',
        errorTypes: [
          {
            errorText: 'Please enter a valid email address!',
            errorType: 'email',
          },
          {
            errorText: 'This is required!',
            errorType: 'required'
          }
        ]
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      // Note: The dialog's result will return `undefined` if the user clicked
      // outside of the dialog
      if (result !== -1 && result !== undefined) {
        this.auth.resetPassword(result).then(_ => {
          this.shared.openSnackBar({
            msg: `Successfully reset email ${result}! Please check your email for the password reset email.`,
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
      localStorage.setItem('loggedIn', 'true');
    }).catch((error) => {
      this.handleError(error);
    });
  }
  loginWithEmailAndPassword() {
    this.auth.logInWithEmailAndPassword(this.loginForm.get('email').value, this.loginForm.get('password').value).then((result) => {
      this.shared.openSnackBar({ msg: `Signed in as ${result.user.email}` });
    }).catch((error) => {
      this.handleError(error);
    });
  }
  private handleError(error: any) {
    console.log(error);
    this.shared.openSnackBar({ msg: `Error: ${error.message}` });
  }
}
