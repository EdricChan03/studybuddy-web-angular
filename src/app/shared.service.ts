import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

import { environment } from '../environments/environment';
import { Settings } from './interfaces';
import { SettingsStorageService } from './pages/settings/settings-storage.service';

export interface SnackBarOpts<D = any> {
  /** The snackbar's message. */
  msg: string;
  /** The snackbar's action. */
  action?: string;
  /** A component to open the snackbar with. */
  component?: ComponentType<any>;
  /** Configuration for the snackbar. */
  config?: MatSnackBarConfig<D>;
  /**
   * Additional options for the snackbar.
   * @deprecated Use {@link SnackBarOpts#config} instead
   */
  additionalOpts?: MatSnackBarConfig<D>;
}

// Shared service
@Injectable()
export class SharedService {
  private _title = '';
  /** The document's title suffix. */
  readonly titleSuffix = 'Study Buddy';
  constructor(
    private breakpointObserver: BreakpointObserver,
    private settingsStorage: SettingsStorageService,
    private snackBar: MatSnackBar,
    private documentTitle: Title,
  ) { }
  // Getters and setters
  get title(): string { return this._title; }
  set title(title: string) {
    this._title = title;
    if (title !== '') {
      title = `${title} | `;
    }
    this.documentTitle.setTitle(`${title}${this.titleSuffix}`);
  }

  /** Checks if the user is online. */
  get isOnline(): boolean {
    return navigator.onLine;
  }

  /** Detects if the user is using a mobile device based on CSS media queries. */
  get isMobile(): boolean {
    return this.breakpointObserver.isMatched(Breakpoints.Handset);
  }

  /** Detects if the user is using a handset in portrait mode based on CSS media queries. */
  get isPortraitHandset(): boolean {
    return this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait);
  }

  /**
   * Returns the settings saved to `localStorage`.
   * Note: If the settings haven't been set yet, it will return `null`.
   */
  get settings(): Settings {
    return this.settingsStorage.getSetting<Settings>('settings', null);
  }
  set settings(settings: Settings) {
    this.settingsStorage.setSetting('settings', settings);
  }

  /** Checks if dark theme is enabled. */
  get isDarkThemeEnabled(): boolean {
    if (this.settingsStorage.hasSetting('appearanceSettings')) {
      const appearanceSettings = this.settingsStorage.getSetting('appearanceSettings');
      if ('enableDarkTheme' in appearanceSettings) {
        return appearanceSettings['enableDarkTheme'];
      }
    } else if (this.settingsStorage.hasSetting('settings')) {
      const oldSettings = this.settingsStorage.getSetting('settings');
      if ('enableDarkTheme' in oldSettings) {
        return oldSettings['enableDarkTheme'];
      }
    }
    return false;
  }

  /** Checks if the app is in production mode. */
  get isProduction(): boolean {
    return environment.production;
  }

  /**
   * Opens a snackbar with the specified options.
   * @param opts The options of the snackbar
   * @returns The snackbar reference
   */
  openSnackBar(opts: SnackBarOpts): MatSnackBarRef<SimpleSnackBar> {
    return this.handleSnackBar(opts);
  }
  /**
   * Opens a snackbar component with the specified options.
   * @param opts The options of the snackbar
   * @returns The snackbar reference
   */
  openSnackBarComponent(opts: SnackBarOpts): MatSnackBarRef<any> {
    return this.handleSnackBarWithComponent(opts);
  }

  private handleSnackBar(opts: SnackBarOpts): MatSnackBarRef<SimpleSnackBar> {
    // tslint:disable-next-line:deprecation
    const config = opts.config ? opts.config : opts.additionalOpts;
    return this.snackBar.open(opts.msg, opts.action ? opts.action : undefined, config);
  }

  private handleSnackBarWithComponent(opts: SnackBarOpts): MatSnackBarRef<any> {
    // tslint:disable-next-line:deprecation
    const config = opts.config ? opts.config : opts.additionalOpts;
    return this.snackBar.openFromComponent(opts.component, config);
  }

  /** Closes the current snackbar. */
  closeSnackBar() {
    this.snackBar.dismiss();
  }

  /**
   * Generates a random hex color
   * @returns A random hexadecimal color
   */
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

const SHARED_MODULES = [
  CommonModule,
  MatSnackBarModule
];

@NgModule({
  imports: SHARED_MODULES,
  providers: [SharedService]
})
export class SharedModule { }
