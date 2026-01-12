import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthService } from '@app/auth.service';
import { SharedService } from '@app/shared.service';
import { ToolbarService } from '@app/toolbar.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnDestroy, OnInit {
  resetPwdForm: UntypedFormGroup;
  showConfirmedMsg = false;
  constructor(
    private auth: AuthService,
    private shared: SharedService,
    private toolbar: ToolbarService,
    fb: UntypedFormBuilder
  ) {
    shared.title = 'Reset Password';
    toolbar.showToolbar = false;

    this.resetPwdForm = fb.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  ngOnDestroy() {
    this.toolbar.showToolbar = true;
  }

  ngOnInit() {

  }

  resetPassword() {
    this.auth.resetPassword(this.resetPwdForm.get('email').value).then(() => {
      this.shared.openSnackBar({
        msg: 'A password reset email has been successfully sent to your account.'
      });
      this.showConfirmedMsg = true;
    }, error => {
      this.shared.openSnackBar({
        msg: `The password reset email couldn\'t be sent: ${error.message}`
      });
      console.error('Couldn\'t send password reset email:', error);
    });
  }
}
