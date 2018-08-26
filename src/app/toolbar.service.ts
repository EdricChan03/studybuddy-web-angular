import { Injectable } from '@angular/core';

@Injectable()
export class ToolbarService {
  /**
   * Whether to show the toolbar
   */
  private _toolbarShow = true;
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
   * Sets the progress bar
   * @param shown Whether to show the progress bar
   * @param indeterminate Whether to enable indeterminate mode for the progress bar
   * @param percentage The percentage of the progress bar (only applies in determinate mode)
   */
  setProgress(shown: boolean, indeterminate?: boolean, percentage?: number) {
    this._progressShown = shown;
    if (indeterminate !== undefined && indeterminate != null) {
      this._progressIndeterminate = indeterminate;
    }
    if (percentage !== undefined && percentage != null) {
      if (percentage >= 0 && percentage <= 100) {
        this._progressPercent = percentage;
      } else {
        throw new Error('Please specify a number for the percentage.');
      }
    }
  }
}
