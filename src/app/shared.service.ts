import { Component, Injectable, NgModule, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarModule,
  MatSnackBarRef,
  SimpleSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { SafeHtml, Title } from '@angular/platform-browser';

import { BreakpointObserver } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentType } from '@angular/cdk/portal';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { Settings } from './interfaces';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToolbarService } from './toolbar.service';

/**
 * This callback gets called when the action button has been clicked
 * @callback SharedService~actionBtnCallback
 */

/**
 * This callback gets called when the toolbar button has been clicked
 * @callback SharedService~toolbarBtnCallback
 * @param event The event of the button
 */

/**
 * Extra toolbar
 */
export interface ExtraToolbarConfig {
  text: string;
  color?: ThemePalette;
  btnText?: string;
  btnType?: 'button' | 'raised-button' | 'flat-button' | 'stroked-button' | 'icon-button' | 'fab';
  btnBadge?: number;
  btnRouterLink?: string | string[] | any;
  btnCallback?: (ev?: Event) => void;
  showDismiss?: boolean;
}
// Shared service
@Injectable()
export class SharedService {
  constructor(
    public snackbar: MatSnackBar,
    public dialog: MatDialog,
    public documentTitle: Title,
    public breakpointObserver: BreakpointObserver
  ) { }
  private _title = '';
  private _extraToolbarConfig: ExtraToolbarConfig;
  // Getters and setters
  get title(): string { return this._title; }
  set title(title: string) {
    this._title = title;
    if (title !== '') {
      title = `${title} | `;
    }
    this.documentTitle.setTitle(`${title}Study Buddy`);
  }
  /**
   * Getter to check if the user is online
   * @returns {boolean}
   */
  get isOnline(): boolean {
    return navigator.onLine;
  }
  /**
   * Detects if the user is using a mobile device
   * @returns {boolean}
   */
  get isMobile(): boolean {
    if (this.breakpointObserver.isMatched('(max-width: 599px)')) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Returns the settings saved to LocalStorage.
   * Note: If the settings haven't been set yet, it will return `null`.
   */
  get settings(): Settings {
    return window.localStorage.getItem('settings') === null ? null : <Settings>JSON.parse(window.localStorage.getItem('settings'));
  }
  set settings(settings: Settings) {
    window.localStorage.setItem('settings', JSON.stringify(settings));
  }
  /**
   * Checks if dark theme mode is enabled
   */
  get isDarkThemeEnabled() {
    if (this.settings === null) {
      return false;
    } else {
      if (this.settings.hasOwnProperty('enableDarkTheme')) {
        return this.settings.enableDarkTheme;
      } else {
        return false;
      }
    }
  }
  get extraToolbarConfig(): ExtraToolbarConfig {
    return this._extraToolbarConfig;
  }
  get showExtraToolbar(): boolean {
    return this._extraToolbarConfig !== null;
  }
  set extraToolbarConfig(extraToolbarConfig: ExtraToolbarConfig) {
    this._extraToolbarConfig = extraToolbarConfig;
  }
  /**
   * Opens a snack-bar with the specified params and a return of the snackbar's ref (for component)
   * @param opts The options of the snack-bar
   * @returns The snack-bar's ref
   */
  openSnackBarComponent(opts: SnackBarConfig): MatSnackBarRef<any> {
    return this.handleSnackBarWithComponent(opts);
  }
  /**
   * Opens a snack-bar with the specified params and a return of the snackbar's ref (not for component)
   * @param opts The options of the snackbar
   * @returns The snackbar's ref
   */
  openSnackBar(opts: SnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    return this.handleSnackBar(opts);
  }
  /**
   * Opens a snack-bar with arguments. (A simplified version of {@link #openSnackBar})
   * @param msg The message for the snack-bar.
   * @param action The action for the snack-bar. Leave as `null` to remove the action.
   * @param duration The duration for the snack-bar to appear.
   * @param hasElevation (Now deprecated!) Whether to show the elevation. Specify a number for the elevation level.
   * @param showHorizontal Configuration on where to show the snack-barhorizontally.
   * @param showVertical Configuration on where to show the snack-bar vertically.
   * @returns The snack-bar's ref.
   */
  openSnackBarWithOpts(
    msg: string,
    action?: string,
    duration?: number,
    hasElevation?: boolean | string,
    showHorizontal?: MatSnackBarHorizontalPosition,
    showVertical?: MatSnackBarVerticalPosition
  ): MatSnackBarRef<SimpleSnackBar> {
    let snackBarRef: MatSnackBarRef<SimpleSnackBar>;
    // Configuration options
    if (showHorizontal || showVertical || duration) {
      const snackBarConfig = new MatSnackBarConfig();
      // Elevation options
      // Note: Since Angular Material v7, the snackbar styling was revamped to the new Material
      // Design spec.
      // Thus, this feature will be deprecated.
      /*
      if (hasElevation) {
        if (typeof hasElevation === 'number') {
          snackBarConfig.panelClass += `mat-elevation-z${hasElevation}`;
        } else {
          snackBarConfig.panelClass += 'mat-elevation-z3';
        }
      }
      */
      // Config option for horizontal
      if (showHorizontal) {
        snackBarConfig.horizontalPosition = showHorizontal;
      }
      // Config option for vertical
      if (showVertical) {
        snackBarConfig.verticalPosition = showVertical;
      }
      // Config option for duration
      if (duration) {
        snackBarConfig.duration = duration;
      }
      // Config option for action
      if (action) {
        snackBarRef = this.snackbar.open(msg, action, snackBarConfig);
      } else {
        snackBarRef = this.snackbar.open(msg, null, snackBarConfig);
      }
    } else {
      if (action) {
        snackBarRef = this.snackbar.open(msg, action);
      } else {
        snackBarRef = this.snackbar.open(msg);
      }
    }
    return snackBarRef;
  }
  /**
   * Method for handling snack-bar related methods
   * @param opts The configuration options for the snackbar
   * @returns The snack-bar's ref
   */
  private handleSnackBar(opts: SnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    if (opts) {
      if (opts.action) {
        if (opts.additionalOpts) {
          if (opts.additionalOpts.panelClass) {
            if (typeof opts.additionalOpts.panelClass === 'string') {
              const tempArray = [];
              /*
              if (typeof opts.hasElevation === 'number') {
                tempArray.push(`mat-elevation-z${opts.hasElevation}`);
              } else {
                tempArray.push('mat-elevation-z3');
              }
              */
              tempArray.push(opts.additionalOpts.panelClass);
              opts.additionalOpts.panelClass = tempArray;
            } else {
              /*
              if (typeof opts.hasElevation === 'number') {
                opts.additionalOpts.panelClass = `mat-elevation-z${opts.hasElevation}`;
              } else {
                opts.additionalOpts.panelClass = 'mat-elevation-z3';
              }
              */
            }
          } else {
            /* if (typeof opts.hasElevation === 'number') {
              opts.additionalOpts.panelClass = `mat-elevation-z${opts.hasElevation}`;
            } else {
              opts.additionalOpts.panelClass = 'mat-elevation-z3';
            } */
          }
          return this.snackbar.open(opts.msg, opts.action, opts.additionalOpts);
        } else {
          return this.snackbar.open(opts.msg, opts.action);
        }
      } else {
        if (opts.additionalOpts) {
          if (opts.additionalOpts.panelClass) {
            if (typeof opts.additionalOpts.panelClass === 'string') {
              const tempArray = [];
              /* if (typeof opts.hasElevation === 'number') {
                tempArray.push(`mat-elevation-z${opts.hasElevation}`);
              } else {
                tempArray.push('mat-elevation-z3');
              } */
              tempArray.push(opts.additionalOpts.panelClass);
              opts.additionalOpts.panelClass = tempArray;
            } else {
              /* if (typeof opts.hasElevation === 'number') {
                opts.additionalOpts.panelClass = `mat-elevation-z${opts.hasElevation}`;
              } else {
                opts.additionalOpts.panelClass = 'mat-elevation-z3';
              } */
            }
          } else {
            /* if (typeof opts.hasElevation === 'number') {
              opts.additionalOpts.panelClass = `mat-elevation-z${opts.hasElevation}`;
            } else {
              opts.additionalOpts.panelClass = 'mat-elevation-z3';
            } */
          }
          return this.snackbar.open(opts.msg, undefined, opts.additionalOpts);
        } else {
          return this.snackbar.open(opts.msg);
        }
      }
    } else {
      this.throwError('opts', 'SnackBarConfig');
    }
  }
  /**
   * Method for handling a component snack-bar
   * @param opts The configuration for the component snack-bar
   * @returns The snack-bar's ref
   */
  private handleSnackBarWithComponent(opts: SnackBarConfig): MatSnackBarRef<any> {
    if (opts) {
      if (opts.additionalOpts) {
        if (opts.additionalOpts) {
          return this.snackbar.openFromComponent(opts.component, opts.additionalOpts);
        } else {
          return this.snackbar.openFromComponent(opts.component);
        }
      } else {
        this.throwError('opts.additionalOpts', 'MatSnackBarConfig');
      }
    } else {
      this.throwError('opts', 'SnackBarConfig');
    }
  }
  /**
   * Closes the currently opened snack-bar
   */
  closeSnackBar() {
    this.snackbar.dismiss();
  }
  /**
   * Opens an alert dialog with the specified parameters
   * @param opts The options for the dialog
   * @returns The dialog's ref
   */
  openAlertDialog(opts: AlertDialogConfig): MatDialogRef<AlertDialog> {
    if (opts) {
      const dialogRef = this.dialog.open(AlertDialog);
      dialogRef.componentInstance.alertConfig = opts;
      return dialogRef;
    } else {
      this.throwError('opts', 'AlertDialogConfig');
    }
  }
  /**
   * Opens a confirm dialog with the specified parameters
   * @param opts The options for the dialog
   * @returns The dialog's ref
   */
  openConfirmDialog(opts: ConfirmDialogConfig): MatDialogRef<ConfirmDialog, string | null> {
    if (opts) {
      const dialogRef = this.dialog.open<ConfirmDialog, any, string | null>(ConfirmDialog);
      dialogRef.componentInstance.confirmConfig = opts;
      return dialogRef;
    } else {
      this.throwError('opts', 'ConfirmDialogConfig');
    }
  }
  /**
   * Opens a prompt dialog with the specified parameters
   * @param opts The options for the dialog
   * @returns The dialog ref
   */
  openPromptDialog(opts: PromptDialogConfig): MatDialogRef<PromptDialog, string | null> {
    if (opts) {
      const dialogRef = this.dialog.open<PromptDialog, any, string | null>(PromptDialog);
      dialogRef.componentInstance.promptConfig = opts;
      return dialogRef;
    } else {
      this.throwError('opts', 'PromptDialogConfig');
    }
  }
  /**
   * Opens a selection dialog with the configured options
   * @param opts The options for the dialog
   * @returns The dialog ref
   */
  openSelectionDialog(opts: SelectionDialogConfig): MatDialogRef<SelectionDialog, any> {
    if (opts) {
      const dialogRef = this.dialog.open<SelectionDialog, any, any>(
        SelectionDialog,
        {
          disableClose: true,
          panelClass: 'selection-dialog'
        }
      );
      dialogRef.componentInstance.selectionConfig = opts;
      return dialogRef;
    } else {
      this.throwError('opts', 'SelectionDialogConfig');
    }
  }
  /**
   * Opens a help dialog
   * @param templateRef ;The `TemplateRef` to open the dialog with.
   * @returns The dialog's ref
   */
  openHelpDialog(templateRef: TemplateRef<any>): MatDialogRef<any> {
    return this.dialog.open(templateRef);
  }
  /**
   * Gets all currently opened dialogs
   * @returns All currently opened dialogs
   */
  getDialogs(): MatDialogRef<any>[] {
    return this.dialog.openDialogs;
  }
  /**
   * Closes all dialogs currently opened
   */
  closeAllDialogs() {
    this.dialog.closeAll();
  }
  /**
   * Gets a dialog by its id
   * @param id The ID of the dialog
   * @returns The dialog's ref
   */
  getDialogById(id: string): MatDialogRef<any> {
    return this.dialog.getDialogById(id);
  }
  /**
   * `Observable` for after all dialogs have been closed
   * @returns The `Observable` stream
   */
  afterAllClosed(): Observable<void> {
    return this.dialog.afterAllClosed;
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
  /**
   * Throws an error with the specified parameters
   * @param variable The variable that was not specified
   * @param type The type of variable
   */
  private throwError(variable: string, type: string) {
    // tslint:disable-next-line:max-line-length
    throw new Error(`"${variable}" was not specified. Please ensure that the "${variable}" property is specified and that it is of type "${type}".`);
  }
}


@Component({
  selector: 'alert-dialog',
  template: `
  <h2 matDialogTitle>{{alertConfig.title ? alertConfig.title : 'Alert'}}</h2>
  <mat-dialog-content fxLayout="column" class="mat-typography">
    <p class="mat-body" *ngIf="!alertConfig.isHtml">{{alertConfig.msg}}</p>
    <span *ngIf="alertConfig.isHtml" [innerHTML]="alertConfig.msg"></span>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button
      mat-button
      [color]="alertConfig.okColor ? alertConfig.okColor : 'primary'"
      (click)="close()">
      {{alertConfig.ok ? alertConfig.ok : 'Dismiss'}}
    </button>
  </mat-dialog-actions>
  `
})
export class AlertDialog implements OnInit {
  constructor(private dialogRef: MatDialogRef<AlertDialog>) {
  }
  alertConfig: AlertDialogConfig;
  close() {
    this.dialogRef.close();
  }
  ngOnInit() {
    if (this.alertConfig.disableClose) {
      this.dialogRef.disableClose = true;
    }
  }
}
@Component({
  selector: 'confirm-dialog',
  template: `
  <h2 matDialogTitle>{{confirmConfig.title ? confirmConfig.title : 'Confirm'}}</h2>
  <mat-dialog-content fxLayout="column" class="mat-typography">
    <p class="mat-body" *ngIf="!confirmConfig.isHtml">{{confirmConfig.msg}}</p>
    <span *ngIf="confirmConfig.isHtml" [innerHTML]="confirmConfig.msg"></span>
    <div class="checkbox-box" *ngIf="confirmConfig.hasCheckbox">
      <mat-checkbox
        [color]="confirmConfig.checkboxColor"
        [(ngModel)]="confirmConfig.checkboxValue">
        {{confirmConfig.checkboxLabel}}
      </mat-checkbox>
    </div>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button
      mat-button
      (click)="cancel()"
      [color]="confirmConfig.cancelColor ? confirmConfig.cancelColor : 'primary'">
      {{confirmConfig.cancel ? confirmConfig.cancel : 'Cancel'}}
    </button>
    <button
      mat-button
      (click)="ok()"
      [color]="confirmConfig.okColor ? confirmConfig.okColor : 'primary'"
      [disabled]="okBtnDisabled">
      {{confirmConfig.ok ? confirmConfig.ok : 'OK'}}
    </button>
  </mat-dialog-actions>
  `,
  styles: [
    `
    .checkbox-box {
      padding: 8px;
      border: 1px solid grey;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
    }
    `
  ]
})
export class ConfirmDialog implements OnInit {
  constructor(private dialogRef: MatDialogRef<ConfirmDialog>) {

  }
  get okBtnDisabled() {
    if (this.confirmConfig.dialogRequiresCheckbox) {
      if (this.confirmConfig.checkboxValue) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  confirmConfig: ConfirmDialogConfig;
  cancel() {
    this.dialogRef.close('cancel');
  }
  ok() {
    this.dialogRef.close('ok');
  }
  ngOnInit() {
    if (this.confirmConfig.disableClose) {
      this.dialogRef.disableClose = true;
    }
  }
}
@Component({
  selector: 'prompt-dialog',
  template: `
  <h2 matDialogTitle>{{_returnIfValid(promptConfig.title, 'Prompt')}}</h2>
  <mat-dialog-content fxLayout="column" class="mat-typography">
    <p class="mat-body" *ngIf="!promptConfig.isHtml">{{promptConfig.msg}}</p>
    <span *ngIf="promptConfig.isHtml" [innerHTML]="promptConfig.msg"></span>
    <mat-form-field [color]="_returnIfValid(promptConfig.inputColor, 'primary')" style="width:100%">
      <mat-label>{{promptConfig.placeholder}}</mat-label>
      <input
        matInput
        [type]="_returnIfValid(promptConfig.inputType, 'text')"
        required
        [formControl]="input">
      <ng-container *ngIf="promptConfig?.errorTypes">
        <ng-container *ngFor="let error of promptConfig?.errorTypes">
          <mat-error *ngIf="input?.hasError(error?.errorType)">{{error?.errorText}}</mat-error>
        </ng-container>
      </ng-container>
    </mat-form-field>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-button
      (click)="cancel()"
      [color]="_returnIfValid(promptConfig.cancelColor, 'primary')">
      {{_returnIfValid(promptConfig.cancel, 'Cancel')}}
      </button>
    <button mat-button
      (click)="ok()"
      [color]="_returnIfValid(promptConfig.okColor, 'primary')"
      [disabled]="input?.invalid">
      {{_returnIfValid(promptConfig.ok, 'OK')}}
      </button>
  </mat-dialog-actions>
  `
})
export class PromptDialog implements OnInit {
  constructor(private dialogRef: MatDialogRef<PromptDialog>) { }
  /**
   * The configuration of the dialog
   */
  promptConfig: PromptDialogConfig;
  /**
   * The input of the dialog's prompt
   */
  input: FormControl = new FormControl();
  // Since this is used often in the HTML template, it'll be much easier if this
  // was extracted a method that could be used instead of having to do a null check
  // for checking if the property is non-null. If the property is null, return a default
  // value as specified in the second parameter.
  _returnIfValid(propertyToCheck: any, defaultValue: any): any {
    return propertyToCheck ? propertyToCheck : defaultValue;
  }
  cancel() {
    // Close the dialog with a result of 'cancel'. Developers can check for this event by
    // doing a check if the result of the dialog is 'cancel' when the input's type is set
    // to number, or by checking it the result ofthe dialog is `-1` when the input's type
    // is set to string.
    if (typeof this.input.value === 'number') {
      this.dialogRef.close('cancel');
    } else {
      this.dialogRef.close(-1);
    }
  }
  ok() {
    // Close the dialog with the value of the input. The value of the input can then be
    // accessed by accessing the result of the `afterClosed` event.
    this.dialogRef.close(this.input.value);
  }
  ngOnInit() {
    // Check if the devleoper has set the initial value for the prompt
    if (this.promptConfig.value) {
      this.input.setValue(this.promptConfig.value);
    }
    // Check if the developer has enabled the `disableClose` config setting which prevents the
    // user from clicking outside the dialog to close it.
    if (this.promptConfig.disableClose) {
      this.dialogRef.disableClose = true;
    }
    // HAndler for error types
    if (this.promptConfig.errorTypes) {
      const configErrorTypes = this.promptConfig.errorTypes;
      const errorTypes = [];
      // Loop through
      for (let errorTypeI = 0; errorTypeI < configErrorTypes.length; errorTypeI++) {
        errorTypes.push(configErrorTypes[errorTypeI].errorType);
      }
      console.log(errorTypes);
      this.input.setErrors(errorTypes);
    }
  }
}
@Component({
  selector: 'selection-dialog',
  template: `
  <h2 matDialogTitle>{{selectionConfig.title ? selectionConfig.title : 'Select options from the list'}}</h2>
  <mat-dialog-content fxLayout="column" class="mat-typography">
    <mat-selection-list #selection>
      <mat-list-option
        *ngFor="let option of selectionConfig.options"
        [disabled]="option.disabled"
        [value]="option.value"
        [checkboxPosition]="option.checkboxPosition ? option.checkboxPosition : 'before'"
        [selected]="option.selected">
        {{option.content}}
      </mat-list-option>
    </mat-selection-list>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-button color="primary" (click)="cancel()">{{selectionConfig.cancel ? selectionConfig.cancel : 'Cancel'}}</button>
    <button
      mat-button
      [color]="selectionConfig.okColor ? selectionConfig.okColor : 'primary'"
      (click)="ok()"
      [disabled]="selection.selectedOptions.selected.length < 1">{{selectionConfig.ok ? selectionConfig.ok : 'OK'}}</button>
  </mat-dialog-actions>
  `
})
export class SelectionDialog implements OnInit {
  @ViewChild('selection') selection: MatSelectionList;
  constructor(private dialogRef: MatDialogRef<SelectionDialog>) {
  }
  selectionConfig: SelectionDialogConfig;
  ngOnInit() {
    if (this.selectionConfig.disableClose) {
      this.dialogRef.disableClose = true;
    }
  }
  cancel() {
    this.dialogRef.close('cancel');
  }
  ok() {
    this.dialogRef.close(this.selection.selectedOptions.selected);
  }
}
export class SnackBarConfig {
  /**
   * The message for the snackbar
   */
  msg: string;
  /**
   * The action for the snackbar
   */
  action?: string;
  /**
   * The custom component for the snack-bar to open in
   */
  component?: ComponentType<any>;
  /**
   * Additional options
   */
  additionalOpts?: MatSnackBarConfig;
  /**
   * Whether to show an elevation on the snackbar
   * If a number is supplied, the elevation level will be the specified number. Or else it will be set to level 3
   */
  hasElevation?: number | boolean;
}
export class ErrorSnackBarConfig extends SnackBarConfig {
  /**
   * The icon of the snackbar
   * Defaults to `error`
   */
  icon?: string;
}
export class DialogConfig extends MatDialogConfig {
  /**
   * The message of the dialog
   */
  msg?: string | SafeHtml;
  /**
   * The title of the dialog
   */
  title?: string;
  /**
   * Whether the dialog's message is HTML
   */
  isHtml?: boolean;
  /**
   * The theme color for the dialog
   */
  themeColor?: ThemePalette;
}
export class AlertDialogConfig extends DialogConfig {
  /**
   * The ok button text
   */
  ok?: string;
  /**
   * The ok button color
   */
  okColor?: ThemePalette;
}

export class ConfirmDialogConfig extends DialogConfig {
  /**
   * The ok button text
   */
  ok?: string;
  /**
   * The cancel button text
   */
  cancel?: string;
  /**
   * The ok button color
   */
  okColor?: ThemePalette;
  /**
   * The cancel button color
   */
  cancelColor?: ThemePalette;
  /**
   * Whether the confirm dialog should have a checkbox
   */
  hasCheckbox?: boolean;
  /**
   * The label pf the checkbox. Depends on `hasCheckbox`.
   */
  checkboxLabel?: string;
  /**
   * The color of the checkbox
   */
  checkboxColor?: ThemePalette;
  /**
   * Whether the dialog must have the checkbox checked in order for the ok button to be enabled
   */
  dialogRequiresCheckbox?: boolean;
  /**
   * The initial value of the checkbox
   */
  checkboxValue?: boolean;
}

export interface PromptDialogConfigErrorType {
  /**
   * The text to show when the error occurs
   */
  errorText: string;
  /**
   * The type of error.
   */
  errorType: string;
}

export class PromptDialogConfig extends DialogConfig {
  /**
   * The ok button text
   */
  ok?: string;
  /**
   * The color of the ok button
   */
  okColor?: ThemePalette;
  /**
   * The cancel button text
   */
  cancel?: string;
  /**
   * The color of the cancel button
   */
  cancelColor?: ThemePalette;
  /**
   * The placeholder of the input
   */
  placeholder: string;
  /**
   * The input type
   */
  inputType?: 'text' | 'email' | 'password' | 'number';
  /**
   * The initial value of the input
   */
  value?: string | number;
  /**
   * The color of the input
   */
  inputColor?: ThemePalette;
  /**
   * Error types to show on the input
   */
  errorTypes?: PromptDialogConfigErrorType[];
}
export class SelectionDialogConfig extends DialogConfig {
  /**
   * The ok button text
   */
  ok?: string;
  /**
   * The color of the ok button
   */
  okColor?: ThemePalette;
  /**
   * The cancel button text
   */
  cancel?: string;
  /**
   * The color of the cancel button
   */
  cancelColor?: ThemePalette;
  /**
   * The options for the selection dialog
   */
  options: SelectionDialogOptions[];
}
export class SelectionDialogOptions {
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

const SHARED_DIALOGS = [
  AlertDialog,
  ConfirmDialog,
  PromptDialog,
  SelectionDialog
];
const SHARED_MODULES = [
  BrowserModule,
  BrowserAnimationsModule,
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
