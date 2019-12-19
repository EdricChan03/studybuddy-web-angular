import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { DOCUMENT } from '@angular/common';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { animations } from './animations';
import { AuthService } from './auth.service';
import { UserInfoDialogComponent } from './dialogs';
import { SidenavLink } from './interfaces';
import { Message, MessageImportance, MessagingService } from './messaging.service';
import { SharedService } from './shared.service';
import { ToolbarService } from './toolbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    animations.toggleIconAnimation,
    animations.toggleItemsAnimation
  ]
})
export class AppComponent implements OnInit {
  /**
   * The sidenav
   */
  @ViewChild('left', { static: true }) sidenav: MatSidenav;
  environment = environment;
  user: firebase.User;
  userObservable: Observable<firebase.User>;
  todayDate = new Date();
  showNotificationSettings = false;
  toggleState = [];
  toggleOtherState = [];
  /**
   * Links for the sidenav
   */
  sidenavLinks: SidenavLink[] = [
    {
      link: 'dashboard',
      title: 'Dashboard',
      icon: 'view_quilt'
    },
    {
      link: 'todo',
      title: 'Todos',
      icon: 'check_circle',
      list: [
        {
          link: 'todo/dashboard',
          title: 'Dashboard',
          icon: 'view_quilt'
        },
        {
          link: 'todo/home',
          title: 'Home',
          icon: 'home'
        },
        {
          link: 'todo/archived',
          title: 'Archived',
          icon: 'archive'
        }
      ]
    },
    {
      link: 'downloads',
      title: 'App Downloads',
      icon: 'apps'
    },
    {
      link: 'tips',
      title: 'Tips',
      icon: 'lightbulb_outline'
    },
    {
      link: 'chats',
      title: 'Chats',
      icon: 'chat'
    },
    {
      link: 'cheatsheets',
      title: 'Cheatsheets',
      icon: 'library_books',
      hidden: true
    },
    {
      link: 'notes',
      title: 'Notes',
      icon: 'subject',
      hidden: true
    },
  ];
  /**
   * Other links for the sidenav
   */
  otherLinks: SidenavLink[] = [
    {
      link: 'account',
      title: 'Account',
      icon: 'account_box'
    },
    {
      link: 'settings',
      title: 'Settings',
      icon: 'settings'
    },
    {
      link: 'about',
      title: 'About',
      icon: 'info'
    },
    {
      link: 'support/home',
      title: 'Help',
      icon: 'help_outline'
    }
  ];
  tempId = 0;
  /**
   * Whether the user is signed in
   */
  isSignedIn = false;
  keyMaps = {};
  constructor(
    public shared: SharedService,
    public auth: AuthService,
    // TODO(Edric): Figure out a way to make this private
    public toolbarService: ToolbarService,
    private router: Router,
    private afFs: AngularFirestore,
    private dialog: MatDialog,
    // TODO(Edric): Figure out a way to make this private
    public messagingService: MessagingService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.userObservable = auth.getAuthState();
    auth.getAuthState().subscribe((user) => {
      if (user) {
        this.user = user;
        console.log(user);
        this.isSignedIn = true;
      } else {
        // User is signed out! Show sign in dialog here
        this.isSignedIn = false;

      }
    });

    if (!this.shared.isOnline) {
      const snackBarRef = this.shared.openSnackBar({
        msg: 'You are offline. Some actions will not be available.',
        action: 'Retry'
      });
      snackBarRef.onAction().subscribe(() => {
        window.location.reload(true);
      });
    }

    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (router.url === '/todo') {
          this.toolbarService.showToolbar = true;
        }
      }
      this.navigationInterceptor(event);
    });

    if (this.shared.isDarkThemeEnabled) {
      if (!this.document.body.classList.contains('studybuddy-dark')) {
        this.document.body.classList.add('studybuddy-dark');
      }
    } else {
      if (this.document.body.classList.contains('studybuddy-dark')) {
        this.document.body.classList.remove('studybuddy-dark');
      }
    }
  }
  get isMobile(): boolean {
    return this.shared.isMobile;
  }
  get isSidenavOpened(): boolean {
    return this.sidenav.opened;
  }
  get isAuthenticated(): boolean {
    return this.auth.authenticated;
  }
  ngOnInit() {
    this.sidenavLinks.forEach(item => {
      if (item.list) {
        this.toggleState.push('notToggled');
      }
    });
    if (this.shared.settings !== null && this.shared.settings.hasOwnProperty('showTodosAsTable')) {
      const settingsStorage = this.shared.settings;
      settingsStorage['todoView'] = this.shared.settings['showTodosAsTable'] ? 'table' : 'list';
      this.shared.settings = settingsStorage;
    }
  }
  navigationInterceptor(event: Event) {
    if (event instanceof NavigationStart) {
      this.toolbarService.setProgress(true, true);
    }
    if (event instanceof NavigationEnd) {
      this.toolbarService.setProgress(false);
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.toolbarService.setProgress(false);
    }
    if (event instanceof NavigationError) {
      this.toolbarService.setProgress(false);
    }
  }
  onKeydown($event: KeyboardEvent) {
    // console.log(`key down: ${$event}`);
    console.log(`onKeydown: key: ${$event.key}`);
    console.log(`onKeydown: keyCode: ${$event.keyCode}`);
  }
  toggleList(event: KeyboardEvent | MouseEvent, index: number) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    if (this.toggleState[index]) {
      if (this.toggleState[index] === 'notToggled') {
        this.toggleState[index] = 'toggled';
      } else {
        this.toggleState[index] = 'notToggled';
      }
    } else {
      this.toggleState[index] = 'toggled';
    }
  }
  toggleOtherList(event: KeyboardEvent | MouseEvent, index: number) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    if (this.toggleOtherState[index]) {
      if (this.toggleOtherState[index] === 'notToggled') {
        this.toggleOtherState[index] = 'toggled';
      } else {
        this.toggleOtherState[index] = 'notToggled';
      }
    } else {
      this.toggleOtherState[index] = 'toggled';
    }
  }
  logOut() {
    const dialogRef = this.shared.openConfirmDialog({
      title: 'Log out?',
      msg: 'Changes not saved will be lost.',
      ok: 'Log out',
      okColor: 'warn'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.auth.logOut().then((res) => {
          const snackbarRef = this.shared.openSnackBar({
            msg: 'Signed out',
            action: 'Undo',
            additionalOpts: {
              duration: 4000,
              horizontalPosition: 'start'
            }
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
  closeLeftSidenav(ref: MatSidenav) {
    if (this.shared.settings.closeSidenavOnClick) {
      ref.close();
    }
  }
  openUserInfoDialog() {
    this.dialog.open(UserInfoDialogComponent);
  }
  /**
   * Shows a confirmation dialog before logging out the user.
   */
  signOut() {
    const dialogRef = this.shared.openConfirmDialog({
      title: 'Log out?',
      msg: 'Changes not saved will be lost! Continue?',
      ok: 'Log out',
      okColor: 'warn'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.auth.logOut().then((res) => {
          const snackbarRef = this.shared.openSnackBar({
            msg: 'Signed out',
            action: 'Undo',
            additionalOpts: {
              duration: 4000,
              horizontalPosition: 'start'
            }
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
    this.auth.logInWithGoogle().then((result) => {
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
    this.afFs.doc(`users/${this.user.uid}`)
      .delete()
      .then(() => {
        console.log('Data successfully deleted!');
      })
      .catch((error) => {
        this.handleError(error.message);
      });
  }
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
              action: 'Relogin'
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
  private handleError(errorMsg: string) {
    this.shared.openSnackBar({ msg: `Error: ${errorMsg}` });
  }
}
