import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, Inject, Injectable, NgModule, OnInit, TemplateRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { SafeHtml, Title } from '@angular/platform-browser';
import { Settings } from './interfaces';
import { SettingsStorageService } from './pages/settings/settings-storage.service';

/** An abstract dialog class. */
export abstract class Dialog {
  /** The default color to be used for the dialog's buttons. */
  readonly defaultBtnColor = 'primary';

  abstract get hasActionBtns(): boolean;

  abstract get hideNegativeBtn(): boolean;

  abstract get hideNeutralBtn(): boolean;

  abstract get hidePositiveBtn(): boolean;

  abstract get negativeBtnColor(): ThemePalette;

  abstract get neutralBtnColor(): ThemePalette;

  abstract get positiveBtnColor(): ThemePalette;
}

@Component({
  selector: 'alert-dialog',
  template: `
  <h2 matDialogTitle *ngIf="opts?.title">{{ opts.title }}</h2>
  <mat-dialog-content fxLayout="column" class="mat-typography">
    <p class="mat-body" *ngIf="!opts.isHtml">{{ opts.msg }}</p>
    <span *ngIf="opts.isHtml" [innerHTML]="opts.msg"></span>
  </mat-dialog-content>
  <mat-dialog-actions align="end" *ngIf="hasActionBtns">
    <button mat-button *ngIf="!hideNegativeBtn" [color]="negativeBtnColor" matDialogClose="cancel">{{ opts.negativeBtnText }}</button>
    <button mat-button *ngIf="!hideNeutralBtn" [color]="neutralBtnColor" matDialogClose="neutral">{{ opts.neutralBtnText }}</button>
    <button mat-button *ngIf="!hidePositiveBtn" [color]="positiveBtnColor" matDialogClose="ok">{{ positiveBtnText }}</button>
  </mat-dialog-actions>
  `
})
// tslint:disable-next-line:component-class-suffix
export class AlertDialog extends Dialog {
  /** The default text to be used for the positive button. */
  readonly defaultPositiveBtnText = 'Dismiss';

  constructor(@Inject(MAT_DIALOG_DATA) public opts: AlertDialogOpts) {
    super();
  }

  get hasActionBtns(): boolean {
    if ('hideActionBtns' in this.opts) {
      if (typeof this.opts.hideActionBtns === 'boolean') {
        return !this.opts.hideActionBtns;
      } else if (Array.isArray(this.opts.hideActionBtns)) {
        // Skip the below logic
        return true;
      }
    }

    return 'negativeBtnText' in this.opts || 'neutralBtnText' in this.opts || typeof this.positiveBtnText === 'string';
  }

  get hideNegativeBtn(): boolean {
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('negative');
    }

    return !('negativeBtnText' in this.opts);
  }

  get hideNeutralBtn(): boolean {
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('neutral');
    }

    return !('neutralBtnText' in this.opts);
  }

  get hidePositiveBtn(): boolean {
    // As the default text will be used if no text was specified,
    // the button will always be shown unless explicitly hidden.
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('positive');
    }
  }

  get negativeBtnColor(): ThemePalette {
    return this.opts.negativeBtnColor ? this.opts.negativeBtnColor : this.defaultBtnColor;
  }

  get neutralBtnColor(): ThemePalette {
    return this.opts.neutralBtnColor ? this.opts.neutralBtnColor : this.defaultBtnColor;
  }

  get positiveBtnColor(): ThemePalette {
    // This is to handle users using the now deprecated `okColor` property.
    // tslint:disable-next-line:deprecation
    return this.opts.okColor ? this.opts.okColor : this.opts.positiveBtnColor ? this.opts.positiveBtnColor : this.defaultBtnColor;
  }

  get positiveBtnText(): string {
    // This is to handle users using the now deprecated `ok` property.
    // tslint:disable-next-line:deprecation
    return this.opts.ok ? this.opts.ok : this.opts.positiveBtnText ? this.opts.positiveBtnText : this.defaultPositiveBtnText;
  }
}

@Component({
  selector: 'confirm-dialog',
  template: `
  <h2 matDialogTitle *ngIf="opts?.title">{{ opts.title }}</h2>
  <mat-dialog-content fxLayout="column" class="mat-typography">
    <p class="mat-body" *ngIf="!opts.isHtml">{{ opts.msg }}</p>
    <span *ngIf="opts.isHtml" [innerHTML]="opts.msg"></span>
  </mat-dialog-content>
  <mat-dialog-actions align="end" *ngIf="hasActionBtns">
    <button mat-button *ngIf="!hideNegativeBtn" [color]="negativeBtnColor" matDialogClose="cancel">{{ negativeBtnText }}</button>
    <button mat-button *ngIf="!hideNeutralBtn" [color]="neutralBtnColor" matDialogClose="neutral">{{ opts.neutralBtnText }}</button>
    <button mat-button *ngIf="!hidePositiveBtn" [color]="positiveBtnColor" matDialogClose="ok">{{ positiveBtnText }}</button>
  </mat-dialog-actions>
  `
})
// tslint:disable-next-line:component-class-suffix
export class ConfirmDialog extends Dialog {
  /** The default text to be used for the negative button. */
  readonly defaultNegativeBtnText = 'Cancel';
  /** The default text to be used for the positive button. */
  readonly defaultPositiveBtnText = 'OK';

  constructor(@Inject(MAT_DIALOG_DATA) public opts: ConfirmDialogOpts) {
    super();
  }

  get hasActionBtns(): boolean {
    if ('hideActionBtns' in this.opts) {
      if (typeof this.opts.hideActionBtns === 'boolean') {
        return !this.opts.hideActionBtns;
      } else if (Array.isArray(this.opts.hideActionBtns)) {
        // Skip the below logic
        return true;
      }
    }

    return typeof this.negativeBtnText === 'string' || typeof this.positiveBtnText === 'string' || 'neutralBtnText' in this.opts;
  }

  get hideNegativeBtn(): boolean {
    // As the default text will be used if no text was specified,
    // the button will always be shown unless explicitly hidden.
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('negative');
    }
  }

  get hideNeutralBtn(): boolean {
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('neutral');
    }

    return !('neutralBtnText' in this.opts);
  }

  get hidePositiveBtn(): boolean {
    // As the default text will be used if no text was specified,
    // the button will always be shown unless explicitly hidden.
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('positive');
    }
  }

  get negativeBtnColor(): ThemePalette {
    // This is to handle users using the now deprecated `cancelColor` property.
    // tslint:disable-next-line:deprecation
    return this.opts.cancelColor ? this.opts.cancelColor : this.opts.negativeBtnColor ? this.opts.negativeBtnColor : this.defaultBtnColor;
  }

  get neutralBtnColor(): ThemePalette {
    return this.opts.neutralBtnColor ? this.opts.neutralBtnColor : this.defaultBtnColor;
  }

  get positiveBtnColor(): ThemePalette {
    // This is to handle users using the now deprecated `okColor` property.
    // tslint:disable-next-line:deprecation
    return this.opts.okColor ? this.opts.okColor : this.opts.positiveBtnColor ? this.opts.positiveBtnColor : this.defaultBtnColor;
  }

  get negativeBtnText(): string {
    // This is to handle users using the now deprecated `cancel` property.
    // tslint:disable-next-line:deprecation
    return this.opts.cancel ? this.opts.cancel : this.opts.negativeBtnText ? this.opts.negativeBtnText : this.defaultNegativeBtnText;
  }

  get positiveBtnText(): string {
    // This is to handle users using the now deprecated `ok` property.
    // tslint:disable-next-line:deprecation
    return this.opts.ok ? this.opts.ok : this.opts.positiveBtnText ? this.opts.positiveBtnText : this.defaultPositiveBtnText;
  }
}

@Component({
  selector: 'prompt-dialog',
  template: `
  <h2 matDialogTitle *ngIf="opts?.title">{{ opts?.title }}</h2>
  <mat-dialog-content fxLayout="column" class="mat-typography">
    <p class="mat-body" *ngIf="!opts.isHtml">{{ opts.msg }}</p>
    <span *ngIf="opts.isHtml" [innerHTML]="opts.msg"></span>
    <form #form="ngForm">
      <mat-form-field [color]="inputColor" style="width:100%">
        <mat-label>{{ opts.placeholder }}</mat-label>
        <input
          matInput
          [(ngModel)]="input"
          type="{{opts.inputType ? opts.inputType : 'text'}}"
          required
          name="input">
        <mat-error>This is required.</mat-error>
      </mat-form-field>
    </form>
  </mat-dialog-content>
  <mat-dialog-actions align="end" *ngIf="hasActionBtns">
    <button mat-button *ngIf="!hideNegativeBtn" [color]="negativeBtnColor" matDialogClose="cancel">{{ negativeBtnText }}</button>
    <button mat-button *ngIf="!hideNeutralBtn" [color]="neutralBtnColor" matDialogClose="neutral">{{ opts.neutralBtnText }}</button>
    <button mat-button *ngIf="!hidePositiveBtn" [color]="positiveBtnColor" [matDialogClose]="input" [disabled]="form.invalid">{{ positiveBtnText }}</button>
  </mat-dialog-actions>
  `
})
// tslint:disable-next-line:component-class-suffix
export class PromptDialog extends Dialog implements OnInit {
  input: string | number;
  /** The default text to be used for the negative button. */
  readonly defaultNegativeBtnText = 'Cancel';
  /** The default text to be used for the positive button. */
  readonly defaultPositiveBtnText = 'OK';
  /** The default color to be used for the input. */
  readonly defaultInputColor = 'primary';

  constructor(@Inject(MAT_DIALOG_DATA) public opts: PromptDialogOpts) {
    super();
  }

  get hasActionBtns(): boolean {
    if ('hideActionBtns' in this.opts) {
      if (typeof this.opts.hideActionBtns === 'boolean') {
        return !this.opts.hideActionBtns;
      } else if (Array.isArray(this.opts.hideActionBtns)) {
        // Skip the below logic
        return true;
      }
    }

    return typeof this.negativeBtnText === 'string' || typeof this.positiveBtnText === 'string' || 'neutralBtnText' in this.opts;
  }

  get hideNegativeBtn(): boolean {
    // As the default text will be used if no text was specified,
    // the button will always be shown unless explicitly hidden.
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('negative');
    }
  }

  get hideNeutralBtn(): boolean {
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('neutral');
    }

    return !('neutralBtnText' in this.opts);
  }

  get hidePositiveBtn(): boolean {
    // As the default text will be used if no text was specified,
    // the button will always be shown unless explicitly hidden.
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('positive');
    }
  }

  get negativeBtnColor(): ThemePalette {
    // This is to handle users using the now deprecated `cancelColor` property.
    // tslint:disable-next-line:deprecation
    return this.opts.cancelColor ? this.opts.cancelColor : this.opts.negativeBtnColor ? this.opts.negativeBtnColor : this.defaultBtnColor;
  }

  get neutralBtnColor(): ThemePalette {
    return this.opts.neutralBtnColor ? this.opts.neutralBtnColor : this.defaultBtnColor;
  }

  get positiveBtnColor(): ThemePalette {
    // This is to handle users using the now deprecated `okColor` property.
    // tslint:disable-next-line:deprecation
    return this.opts.okColor ? this.opts.okColor : this.opts.positiveBtnColor ? this.opts.positiveBtnColor : this.defaultBtnColor;
  }

  get negativeBtnText(): string {
    // This is to handle users using the now deprecated `cancel` property.
    // tslint:disable-next-line:deprecation
    return this.opts.cancel ? this.opts.cancel : this.opts.negativeBtnText ? this.opts.negativeBtnText : this.defaultNegativeBtnText;
  }

  get positiveBtnText(): string {
    // This is to handle users using the now deprecated `ok` property.
    // tslint:disable-next-line:deprecation
    return this.opts.ok ? this.opts.ok : this.opts.positiveBtnText ? this.opts.positiveBtnText : this.defaultPositiveBtnText;
  }

  get inputColor(): ThemePalette {
    // This is to handle users using the now deprecated `color` property.
    // tslint:disable-next-line:deprecation
    return this.opts.color ? this.opts.color :
      (this.opts.inputConfig && 'color' in this.opts.inputConfig) ? this.opts.inputConfig.color : this.defaultInputColor;
  }

  ngOnInit() {
    // tslint:disable:deprecation
    if ('value' in this.opts) {
      this.input = this.opts.value;
    } else if ('inputConfig' in this.opts && 'value' in this.opts.inputConfig) {
      this.input = this.opts.inputConfig.value;
    }
    // tslint:enable:deprecation
  }
}

@Component({
  selector: 'selection-dialog',
  template: `
  <h2 matDialogTitle *ngIf="opts?.title">{{ opts.title }}</h2>
  <mat-dialog-content fxLayout="column" class="mat-typography">
    <mat-selection-list #selection>
      <mat-list-option
        *ngFor="let option of opts.options"
        [disabled]="option.disabled"
        [value]="option.value"
        [checkboxPosition]="option.checkboxPosition ? option.checkboxPosition : 'before'"
        [selected]="option.selected">
        {{ option.content }}
      </mat-list-option>
    </mat-selection-list>
  </mat-dialog-content>
  <mat-dialog-actions align="end" *ngIf="hasActionBtns">
    <button mat-button *ngIf="!hideNegativeBtn" [color]="negativeBtnColor" matDialogClose="cancel">{{ negativeBtnText }}</button>
    <button mat-button *ngIf="!hideNeutralBtn" [color]="neutralBtnColor" matDialogClose="neutral">{{ opts.neutralBtnText }}</button>
    <button
      mat-button
      *ngIf="!hidePositiveBtn"
      [color]="positiveBtnColor"
      [matDialogClose]="selection.selectedOptions"
      [disabled]="selection.selectedOptions.selected.length < 1">
      {{ positiveBtnText }}
    </button>
  </mat-dialog-actions>
  `
})
// tslint:disable-next-line:component-class-suffix
export class SelectionDialog extends Dialog {
  /** The default text to be used for the negative button. */
  readonly defaultNegativeBtnText = 'Cancel';
  /** The default text to be used for the positive button. */
  readonly defaultPositiveBtnText = 'OK';

  constructor(@Inject(MAT_DIALOG_DATA) public opts: SelectionDialogOpts) {
    super();
  }

  get hasActionBtns(): boolean {
    if ('hideActionBtns' in this.opts) {
      if (typeof this.opts.hideActionBtns === 'boolean') {
        return !this.opts.hideActionBtns;
      } else if (Array.isArray(this.opts.hideActionBtns)) {
        // Skip the below logic
        return true;
      }
    }

    return typeof this.negativeBtnText === 'string' || typeof this.positiveBtnText === 'string' || 'neutralBtnText' in this.opts;
  }


  get hideNegativeBtn(): boolean {
    // As the default text will be used if no text was specified,
    // the button will always be shown unless explicitly hidden.
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('negative');
    }
  }

  get hideNeutralBtn(): boolean {
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('neutral');
    }

    return !('neutralBtnText' in this.opts);
  }

  get hidePositiveBtn(): boolean {
    // As the default text will be used if no text was specified,
    // the button will always be shown unless explicitly hidden.
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('positive');
    }
  }

  get negativeBtnColor(): ThemePalette {
    return this.opts.negativeBtnColor ? this.opts.negativeBtnColor : this.defaultBtnColor;
  }

  get neutralBtnColor(): ThemePalette {
    return this.opts.neutralBtnColor ? this.opts.neutralBtnColor : this.defaultBtnColor;
  }

  get positiveBtnColor(): ThemePalette {
    return this.opts.positiveBtnColor ? this.opts.positiveBtnColor : this.defaultBtnColor;
  }

  get negativeBtnText(): string {
    // This is to handle users using the now deprecated `cancel` property.
    // tslint:disable-next-line:deprecation
    return this.opts.cancel ? this.opts.cancel : this.opts.negativeBtnText ? this.opts.negativeBtnText : this.defaultNegativeBtnText;
  }

  get positiveBtnText(): string {
    // This is to handle users using the now deprecated `ok` property.
    // tslint:disable-next-line:deprecation
    return this.opts.ok ? this.opts.ok : this.opts.positiveBtnText ? this.opts.positiveBtnText : this.defaultPositiveBtnText;
  }
}

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

export type HideButtonType = 'negative' | 'neutral' | 'positive';

export interface DialogOpts {
  /** The dialog's message. */
  msg: string | SafeHtml;
  /** The dialog's title. */
  title?: string;
  /** Whether the dialog's message is in HTML. */
  isHtml?: boolean;
  /** The positive button's text. */
  positiveBtnText?: string;
  /** The positive button's color. */
  positiveBtnColor?: ThemePalette;
  /** The negative button's text. */
  negativeBtnText?: string;
  /** The negative button's color. */
  negativeBtnColor?: ThemePalette;
  /** The neutral button's text. */
  neutralBtnText?: string;
  /** The neutral button's color. */
  neutralBtnColor?: ThemePalette;
  /**
   * Whether to hide the action buttons.
   *
   * Optionally, you can specify which buttons to hide.
   */
  hideActionBtns?: HideButtonType[] | boolean;
}

export interface AlertDialogOpts extends DialogOpts {
  /**
   * The ok button's text.
   * @deprecated Use {@link DialogOpts#positiveBtnText} instead
   */
  ok?: string;
  /**
   * The ok button's color.
   * @deprecated Use {@link DialogOpts#positiveBtnColor} instead
   */
  okColor?: ThemePalette;
}

export interface ConfirmDialogOpts extends DialogOpts {
  /**
   * The ok button's text.
   * @deprecated Use {@link DialogOpts#positiveBtnText} instead
   */
  ok?: string;
  /**
   * The ok button's color.
   * @deprecated Use {@link DialogOpts#positiveBtnColor} instead
   */
  okColor?: ThemePalette;
  /**
   * The cancel button's text.
   * @deprecated Use {@link DialogOpts#negativeBtnText} instead
   */
  cancel?: string;
  /**
   * The cancel button's color.
   * @deprecated Use {@link DialogOpts#negativeBtnColor} instead
   */
  cancelColor?: ThemePalette;
}

export interface PromptDialogInputConfig {
  /** The input's placeholder. */
  placeholder: string;
  /** The input type. */
  inputType?: string;
  /** The input's initial value. */
  value?: string;
  /** The input's color. */
  color?: ThemePalette;
}

export interface PromptDialogOpts extends DialogOpts {
  /**
   * The ok button's text.
   * @deprecated Use {@link DialogOpts#positiveBtnText} instead
   */
  ok?: string;
  /**
   * The ok button's color.
   * @deprecated Use {@link DialogOpts#positiveBtnColor} instead
   */
  okColor?: ThemePalette;
  /**
   * The cancel button's text.
   * @deprecated Use {@link DialogOpts#negativeBtnText} instead
   */
  cancel?: string;
  /**
   * The cancel button's color.
   * @deprecated Use {@link DialogOpts#negativeBtnColor} instead
   */
  cancelColor?: ThemePalette;
  /** Configuration for the input. */
  inputConfig?: PromptDialogInputConfig;
  /**
   * The input's placeholder.
   * @deprecated Use {@link PromptDialogInputConfig#placeholder} instead
   */
  placeholder: string;
  /**
   * The input type.
   * @deprecated Use {@link PromptDialogInputConfig#inputType} instead
   */
  inputType?: 'text' | 'email' | 'password' | 'number';
  /**
   * The initial value of the input
   * @deprecated Use {@link PromptDialogInputConfig#value} instead
   */
  value?: string | number;
  /**
   * The color of the input
   * @deprecated Use {@link PromptDialogInputConfig#color} instead
   */
  color?: ThemePalette;
}

export interface SelectionDialogOpts extends DialogOpts {
  /**
   * The ok button's text.
   * @deprecated Use {@link DialogOpts#positiveBtnText} instead
   */
  ok?: string;
  /**
   * The cancel button's text.
   * @deprecated Use {@link DialogOpts#negativeBtnText} instead
   */
  cancel?: string;
  /** Options to be shown in the dialog. */
  options: SelectionDialogOption[];
}

export interface SelectionDialogOption {
  /**
   * The title of the selection list item
   */
  content: string;
  /**
   * Whether the selection list item is disabled
   */
  disabled?: boolean;
  /**
   * The value of the selection list item
   */
  value: any;
  /**
   * The checkbox position of the selection list item
   */
  checkboxPosition?: 'before' | 'after';
  /**
   * Whether the selection list item is initially selected
   */
  selected?: boolean;
}

// Shared service
@Injectable()
export class SharedService {
  private _title = '';
  /** The document's title suffix. */
  readonly titleSuffix = 'Study Buddy';
  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private settingsStorage: SettingsStorageService,
    private snackBar: MatSnackBar,
    private documentTitle: Title,
    private breakpointObserver: BreakpointObserver
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
    // return !(this.settings === null) || this.settings['enableDarkTheme'] || this.settings['darkTheme'] || false;
    return this.settings !== null && (this.settings['enableDarkTheme'] || this.settings['darkTheme']);
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

  private createOrGetDialogConfig<D = any>(config?: MatDialogConfig<D>): MatDialogConfig<D> {
    return config ? config : new MatDialogConfig<D>();
  }

  /**
   * Opens an alert dialog with the specified parameters
   * @param opts The options for the dialog.
   * @param config Additional configurations for the dialog.
   * @returns The dialog reference
   */
  openAlertDialog(opts: AlertDialogOpts, config?: MatDialogConfig<AlertDialogOpts>): MatDialogRef<AlertDialog> {
    const tempConfig = this.createOrGetDialogConfig<AlertDialogOpts>(config);
    tempConfig.data = opts;
    return this.dialog.open(AlertDialog, tempConfig);
  }

  /**
   * Opens a confirm dialog with the specified parameters
   * @param opts The options for the dialog
   * @param config Additional configurations for the dialog.
   * @returns The dialog reference
   */
  openConfirmDialog(opts: ConfirmDialogOpts, config?: MatDialogConfig<ConfirmDialogOpts>): MatDialogRef<ConfirmDialog> {
    const tempConfig = this.createOrGetDialogConfig<ConfirmDialogOpts>(config);
    tempConfig.data = opts;
    return this.dialog.open(ConfirmDialog, tempConfig);
  }

  /**
   * Opens a prompt dialog with the specified parameters
   * @param opts The options for the dialog
   * @param config Additional configurations for the dialog.
   * @returns The dialog reference
   */
  openPromptDialog(opts: PromptDialogOpts, config?: MatDialogConfig<PromptDialogOpts>): MatDialogRef<PromptDialog> {
    const tempConfig = this.createOrGetDialogConfig<PromptDialogOpts>(config);
    tempConfig.data = opts;
    return this.dialog.open(PromptDialog, tempConfig);
  }
  /**
   * Opens a selection dialog with the configured options
   * @param opts The options for the dialog
   * @param config Additional configurations for the dialog.
   * @returns The dialog reference
   */
  openSelectionDialog(opts: SelectionDialogOpts, config?: MatDialogConfig<SelectionDialogOpts>): MatDialogRef<SelectionDialog> {
    const tempConfig = this.createOrGetDialogConfig<SelectionDialogOpts>(config);
    tempConfig.data = opts;
    tempConfig.panelClass = 'selection-dialog';
    return this.dialog.open(SelectionDialog, tempConfig);
  }

  /**
   * Opens a help dialog
   * @param templateRef ;The `TemplateRef` to open the dialog with.
   * @returns The dialog's ref
   * @deprecated Use {@link MatDialog#open}
   */
  openHelpDialog<T = any>(templateRef: TemplateRef<T>): MatDialogRef<T> {
    return this.dialog.open<T>(templateRef);
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

const SHARED_DIALOGS = [
  AlertDialog,
  ConfirmDialog,
  PromptDialog,
  SelectionDialog
];
const SHARED_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatIconModule
];
@NgModule({
  imports: SHARED_MODULES,
  declarations: SHARED_DIALOGS,
  entryComponents: SHARED_DIALOGS,
  exports: SHARED_DIALOGS,
  providers: [SharedService]
})
export class SharedModule { }
