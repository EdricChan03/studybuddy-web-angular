import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Settings } from '../interfaces';
import { SharedService } from '../shared.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  updateUserForm: FormGroup;
  currentUser: firebase.User;
  constructor(
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public shared: SharedService
  ) {
    shared.title = 'Settings';
    this.settingsForm = fb.group({
      darkTheme: false,
      closeSidenavOnClick: false
    });
    this.updateUserForm = fb.group({
      displayName: null,
      email: null,
      password: null
    });
    afAuth.user.subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    })
    route.queryParams
      .pipe(
        filter(params => params.panel || params.settingPanel)
      ).subscribe(params => {
        if (params.panel) {
          if (this.settingsPanelIds.includes(params.panel)) {
            this.currentSettingPanel = params.panel;
          } else {
            console.warn(`The currentSettingPanel query parameter is set to an invalid setting panel ID.\nThe available settings panel IDs are ${this.settingsPanelIds.join()}`);
          }
        } else if (params.settingPanel) {
          if (this.settingsPanelIds.includes(params.settingPanel)) {
            this.currentSettingPanel = params.settingPanel;
          } else {
            console.warn(`The settingPanel query parameter is set to an invalid setting panel ID.\nThe available settings panel IDs are ${this.settingsPanelIds.join()}`);
          }
        }
      })
  }
  currentSettingPanel = 'appearance';
  settingsPanels = [
    {
      name: 'Account',
      id: 'account',
      description: 'Account-related actions'
    },
    {
      name: 'Appearance',
      id: 'appearance',
      description: 'Configure how the site is displayed'
    },
    {
      name: 'Experiments',
      id: 'experiments',
      description: 'Enable feature flags'
    },
    {
      name: 'Behaviour',
      id: 'behaviour',
      description: 'Configure the behaviour of the site'
    }
  ];
  settingsPanelIds = this.settingsPanels.map(panel => panel.id);
  defaultSettings: Settings = {
    enableCalendar: false,
    enableNotifications: false,
    enableExperimental: false,
    darkTheme: false,
    todoView: 'table',
    closeSidenavOnClick: true
  };

  showSettingsPanel(panelId: string) {
    this.currentSettingPanel = panelId;
  }
  saveSettings() {
    if (this.settingsForm.value) {
      let tempSettings: Settings;
      if (this.shared.settings !== null) {
        tempSettings = this.shared.settings;
      } else {
        tempSettings = {};
      }
      window.localStorage['settings'] = JSON.stringify(this.settingsForm.value);
      const snackBarRef = this.shared.openSnackBar({
        msg: 'Settings saved',
        action: 'Undo',
        additionalOpts: { duration: 6000 }
      });
      snackBarRef.onAction().subscribe(() => {
        this.shared.settings = tempSettings;
        tempSettings = null;
        this.settingsForm.patchValue(this.retrieveSettings());
      });
    } else {
      console.error('Could not save settings as the variable is undefined.');
    }
  }
  retrieveSettings(): Settings {
    return this.shared.settings || {};
  }
  resetSettings() {
    const dialogRef = this.shared.openConfirmDialog({
      title: 'Delete settings?',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'ok') {
          window.localStorage.setItem('settings', JSON.stringify(this.defaultSettings));
          this.settingsForm.patchValue(this.retrieveSettings());
          this.shared.openSnackBar({ msg: 'Settings were reset' });
        }
      }
    });
  }

  updateUserParticulars() {
    if (this.currentUser) {
      const displayNameVal = this.updateUserForm.get('displayName').value;
      const emailVal = this.updateUserForm.get('email').value;
      // There is no current way of checking against the actual user's password
      // It would be a security issue if there *was* a way of checking the user's password
      const passwordVal = this.updateUserForm.get('password').value;
      if (this.updateUserForm.pristine || (displayNameVal && emailVal && passwordVal)) {
        this.shared.openSnackBar({
          msg: 'Please supply a display name/email/password to update!',
          additionalOpts: {
            duration: 8000
          }
        });
      }
      if (displayNameVal) {
        if (displayNameVal === this.currentUser.displayName)
        this.currentUser.updateProfile({
          displayName: displayNameVal
        })
          .then(() => {
            this.shared.openSnackBar({ msg: `Successfully updated display name to "${displayNameVal}"!` });
          })
          .catch((error) => {
            this.shared.openSnackBar({
              msg: `An error occurred while attempting to update the display name to "${displayNameVal}": ${error.message}`,
              additionalOpts: {
                duration: 8000
              }
            });
          })
      }
      if (emailVal) {
        if (emailVal !== this.currentUser.email) {
          this.currentUser.updateEmail(emailVal)
            .then(() => {
              this.shared.openSnackBar({ msg: `Successfully updated email to ${emailVal}!` });
            })
            .catch((error) => {
              this.shared.openSnackBar({
                msg: `An error occurred while attempting to update the email to ${emailVal}: ${error.message}`,
                additionalOpts: {
                  duration: 8000
                }
              });
            })
        }
      }
      if (passwordVal) {
        this.currentUser.updatePassword(passwordVal)
          .then(() => {
            this.shared.openSnackBar({ msg: `Successfully updated password!` });
          })
          .catch((error) => {
            this.shared.openSnackBar({
              msg: `An error occurred while attempting to update the password: ${error.message}`,
              additionalOpts: {
                duration: 8000
              }
            });
          })
      }
    } else {
      this.shared.openSnackBar({
        msg: 'You need to be logged in to update your particulars!',
        action: 'Log in',
        additionalOpts: {
          duration: 8000
        }
      })
      .onAction()
      .subscribe(() => {
        this.router.navigate(['/login']);
      })
    }
  }
  deleteAccount() {
    this.shared.openConfirmDialog({
      title: 'Delete account?',
      msg: `Are you sure you want to delete your account?
      This is permanent and cannot be reversed!`,
      okColor: 'warn'
    })
    .afterClosed()
    .subscribe(result => {
      if (result === 'ok') {
        this.currentUser.delete()
          .then(() => {
            this.shared.openSnackBar({
              msg: 'Successfully deleted account!'
            });
          })
          .catch((error) => {
            if (error['code'] === 'auth/requires-recent-login') {
              // Reauthenticate the user
              this.shared.openSnackBar({
                msg: 'Please reauthenticate before deleting your account',
                action: 'Reauthenticate',
                additionalOpts: {
                  duration: 8000
                }
              })
              .onAction()
              .subscribe(() => {
                this.currentUser.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => {
                  this.deleteAccount();
                })
                  .catch((snackBarError) => {
                    console.error(snackBarError);
                    this.shared.openSnackBar({
                      msg: `An error occurred while attempting to reauthenticate: ${snackBarError.message}`,
                      action: 'Retry',
                      additionalOpts: {
                        duration: 8000
                      }
                    })
                    .onAction()
                    .subscribe(this.deleteAccount);
                  });
              });
            }
          })
      }
    })
  }

  ngOnInit() {
    const settings = this.retrieveSettings();
    const formVal = {};
    for (const key in settings) {
      switch (key) {
        case 'darkTheme':
        case 'enableDarkTheme':
          formVal['darkTheme'] = settings[key];
          break;
        case 'closeSidenavOnClick':
          formVal['closeSidenavOnClick'] = settings[key];
          break;
        default:
          console.warn(`Key ${key} is currently not handled!`);
          break;
      }
    }
    this.settingsForm.patchValue(formVal);
  }
}
