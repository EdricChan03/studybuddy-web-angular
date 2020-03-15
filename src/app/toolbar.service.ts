import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable()
export class ToolbarService {
  /**
   * Whether to show the toolbar
   */
  private _toolbarShow = true;
  /** The current instance of the sidenav. */
  private _sidenav: MatSidenav;
  /**
   * Whether to show a progress bar
   */
  private _progressShown = false;
  /**
   * The progress percentage of the progress bar
   */
  private _progressPercent = 0;
  /**
   * Whether to enable indeterminate mode for the progress bar
   */
  private _progressIndeterminate = true;

  set showToolbar(value: boolean) {
    this._toolbarShow = value;
  }
  get showToolbar() {
    return this._toolbarShow;
  }

  get sidenav() {
    return this._sidenav;
  }
  set sidenav(sidenav: MatSidenav) {
    this._sidenav = sidenav;
  }

  get showProgress() {
    return this._progressShown;
  }
  get progressPercentage() {
    return this._progressPercent;
  }
  get progressIndeterminate() {
    return this._progressIndeterminate;
  }

  /**
   * Sets the current progress bar state.
   * @param shown Whether to show the progress bar
   * @param indeterminate Whether to enable indeterminate mode for the progress bar
   * @param percentage The percentage of the progress bar (only applies in determinate mode) (specify as a whole number between 0 and 100)
   */
  setProgress(shown: boolean, indeterminate?: boolean, percentage?: number) {
    this._progressShown = shown;
    if (indeterminate !== undefined) {
      this._progressIndeterminate = indeterminate;
    }
    if (percentage !== undefined) {
      if (percentage >= 0 && percentage <= 100) {
        this._progressPercent = percentage;
      } else {
        throw new Error('Specified progress percentage is not within the ranges 0 - 100.');
      }
    }
  }
}
