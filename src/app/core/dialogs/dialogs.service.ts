import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { PortalDialogComponent } from './portal-dialog/portal-dialog.component';
import { PromptDialogComponent } from './prompt-dialog/prompt-dialog.component';
import { SelectionDialogComponent } from './selection-dialog/selection-dialog.component';

import { Dialog } from './dialog';
import { DialogsModule } from './dialogs.module';
import {
  DialogOpts,
  DialogResult,
  DialogType,
  PortalDialogOpts,
  PromptDialogOpts,
  SelectionDialogOpts
} from './models';

@Injectable({
  // Note: Angular auto-adds the service to the module as a provider.
  providedIn: DialogsModule
})
export class DialogsService {
  constructor(private dialog: MatDialog) { }

  private createOrGetDialogConfig<D = any>(config?: MatDialogConfig<D>): MatDialogConfig<D> {
    return config ? config : new MatDialogConfig<D>();
  }

  private setDefaultOpts<Opts extends DialogOpts>(opts: Opts, dialogType: DialogType): Opts {
    switch (dialogType) {
      case 'alert':
      case 'portal':
        if (!('positiveBtnText' in opts)) {
          opts.positiveBtnText = 'Dismiss';
        }
        break;
      case 'confirm':
      case 'prompt':
        if (!('negativeBtnText' in opts)) {
          opts.negativeBtnText = 'Cancel';
        }
        if (!('positiveBtnText' in opts)) {
          opts.positiveBtnText = 'Confirm';
        }
        break;
      default:
        // No-op
        break;
    }
    return opts;
  }

  private openDialog<Opts extends DialogOpts, T extends Dialog>(
    dialogType: DialogType,
    opts: Opts,
    config?: MatDialogConfig<Opts>
  ): MatDialogRef<T, DialogResult> {
    const tempConfig = this.createOrGetDialogConfig<Opts>(config);
    const tempOpts = this.setDefaultOpts(opts, dialogType);
    tempConfig.data = tempOpts;
    let dialogRef: MatDialogRef<any, DialogResult> = null;
    switch (dialogType) {
      case 'alert':
      case 'confirm':
      case 'message':
        dialogRef = this.dialog.open(MessageDialogComponent, tempConfig);
        break;
      case 'prompt':
        dialogRef = this.dialog.open(PromptDialogComponent, tempConfig);
        break;
      case 'portal':
        dialogRef = this.dialog.open(PortalDialogComponent, tempConfig);
        break;
      case 'selection':
        tempConfig.panelClass = 'selection-dialog';
        dialogRef = this.dialog.open(PortalDialogComponent, tempConfig);
        break;
      default:
        throw new Error(`Unsupported dialog type ${dialogType} was specified! Skipping...`);
    }
    return dialogRef;
  }

  /**
   * Opens an alert dialog with the specified parameters
   * @param opts The options for the dialog.
   * @param config Additional configurations for the dialog.
   * @returns The dialog reference
   * @deprecated Use `DialogsService#openMessageDialog` instead
   */
  openAlertDialog(
    opts: DialogOpts,
    config?: MatDialogConfig<DialogOpts>
  ): MatDialogRef<MessageDialogComponent, DialogResult> {
    return this.openDialog<DialogOpts, MessageDialogComponent>('alert', opts, config);
  }

  /**
   * Opens a confirm dialog with the specified parameters
   * @param opts The options for the dialog
   * @param config Additional configurations for the dialog.
   * @returns The dialog reference
   * @deprecated Use `DialogsService#openMessageDialog` instead
   */
  openConfirmDialog(
    opts: DialogOpts,
    config?: MatDialogConfig<DialogOpts>
  ): MatDialogRef<MessageDialogComponent, DialogResult> {
    return this.openDialog<DialogOpts, MessageDialogComponent>('confirm', opts, config);
  }

  /**
   * Opens a message dialog with the specified parameters
   * @param opts Options for the dialog
   * @param config Additional configuration for the dialog
   * @returns The dialog reference
   */
  openMessageDialog(
    opts: DialogOpts,
    config?: MatDialogConfig<DialogOpts>
  ): MatDialogRef<MessageDialogComponent, DialogResult> {
    return this.openDialog<DialogOpts, MessageDialogComponent>('message', opts, config);
  }

  /**
   * Opens a prompt dialog with the specified parameters
   * @param opts The options for the dialog
   * @param config Additional configurations for the dialog.
   * @returns The dialog reference
   */
  openPromptDialog(
    opts: PromptDialogOpts,
    config?: MatDialogConfig<PromptDialogOpts>
  ): MatDialogRef<PromptDialogComponent, DialogResult> {
    return this.openDialog<PromptDialogOpts, PromptDialogComponent>('prompt', opts, config);
  }
  /**
   * Opens a selection dialog with the configured options
   * @param opts The options for the dialog
   * @param config Additional configurations for the dialog.
   * @returns The dialog reference
   */
  openSelectionDialog(
    opts: SelectionDialogOpts,
    config?: MatDialogConfig<SelectionDialogOpts>
  ): MatDialogRef<SelectionDialogComponent, DialogResult> {
    return this.openDialog<SelectionDialogOpts, SelectionDialogComponent>('selection', opts, config);
  }

  /**
   * Opens a portal dialog with the specified parameters
   * @param opts The options for the dialog
   * @param config Additional configurations for the dialog
   * @template T The portal's type
   * @returns The dialog reference
   */
  openPortalDialog<T>(
    opts: PortalDialogOpts<T>,
    config?: MatDialogConfig<PortalDialogOpts<T>>
  ): MatDialogRef<PortalDialogComponent, DialogResult> {
    return this.openDialog<PortalDialogOpts<T>, PortalDialogComponent>('portal', opts, config);
  }
}
