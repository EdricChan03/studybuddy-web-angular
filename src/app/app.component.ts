import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { DialogsService } from './core/dialogs/dialogs.service';
import { PanelService } from './core/panel/panel.service';
import { UserInfoDialogComponent } from './dialogs';
import { SidenavLink } from './interfaces';
import { SharedService } from './shared.service';
import { ToolbarService } from './toolbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  @ViewChild('left', { static: true }) sidenav: MatSidenav;
  @ViewChild('rightPanel', { static: true }) rightPanel: MatSidenav;
  user: firebase.User;
  userObservable: Observable<firebase.User>;
  sidenavLinks: SidenavLink[] = [
    {
      link: 'dashboard',
      title: 'Dashboard',
      icon: 'dashboard'
    },
    {
      link: 'todo',
      title: 'Todos',
      icon: 'check_circle',
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
    }
  ];
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
    }
  ];
  isSignedIn = false;
  keyMaps = {};
  constructor(
    public auth: AuthService,
    private coreDialogs: DialogsService,
    public shared: SharedService,
    // TODO(Edric): Figure out a way to make this private
    public toolbarService: ToolbarService,
    router: Router,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    public panelService: PanelService,
    remoteConfig: AngularFireRemoteConfig
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

    router.events.subscribe(event => this.navigationInterceptor(event));

    if (this.shared.isDarkThemeEnabled) {
      if (!this.document.body.classList.contains('studybuddy-dark')) {
        this.document.body.classList.add('studybuddy-dark');
      }
    } else {
      if (this.document.body.classList.contains('studybuddy-dark')) {
        this.document.body.classList.remove('studybuddy-dark');
      }
    }

    // Fetch and activate Firebase Remote Config
    // See https://firebase.google.com/docs/reference/js/firebase.remoteconfig.RemoteConfig#fetch-and-activate
    // for what the result of the `Promise` means
    remoteConfig.fetchAndActivate().then(result => {
      console.log(result ?
        'Successfully activated the fetched configuration!' :
        'Fetched configuration was already activated. Skipping...');
    }, error => {
      console.error('An error occurred while attempting to fetch and activate the Remote Config:', error);
    });
  }

  get isSidenavOpened(): boolean {
    return this.sidenav.opened;
  }

  ngOnInit() {
    this.panelService.panel = this.rightPanel;
    this.toolbarService.sidenav = this.sidenav;
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

  logOut() {
    const dialogRef = this.coreDialogs.openConfirmDialog({
      title: 'Log out?',
      msg: 'Changes not saved will be lost.',
      positiveBtnText: 'Log out',
      positiveBtnColor: 'warn'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.auth.logOut().then((res) => {
          const snackbarRef = this.shared.openSnackBar({
            msg: 'Signed out',
            additionalOpts: {
              duration: 4000,
              horizontalPosition: 'start'
            }
          });
          console.log(res);
        }).catch((error) => {
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

  private handleError(errorMsg: string) {
    this.shared.openSnackBar({ msg: `Error: ${errorMsg}` });
  }
}
