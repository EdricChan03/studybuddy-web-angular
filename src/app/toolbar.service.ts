import { Injectable } from '@angular/core';

@Injectable()
export class ToolbarService {
	/**
	 * Whether to show the toolbar
	 * @type {boolean}
	 */
	private _toolbarShown: boolean = true;
	/**
	 * Whether to show a progress bar
	 * @type {boolean}
	 */
	private _progressShown: boolean = false;
	/**
	 * The progress percentage of the progress bar
	 * @type {number}
	 */
	private _progressPercent: number = 0;
	/**
	 * Whether to enable indeterminate mode for the progress bar
	 * @type {boolean}
	 */
	private _progressIndeterminate: boolean = true;
	set showToolbar(value: boolean) {
		this._toolbarShown = value;
	}
	get showToolbar() {
		return this._toolbarShown;
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
	 * @param {boolean} shown Whether to show the progress bar
	 * @param {boolean} [indeterminate] Whether to enable indeterminate mode for the progress bar
	 * @param {number} [percentage] The percentage of the progress bar (only applies in determinate mode)
	 */
	setProgress(shown: boolean, indeterminate?: boolean, percentage?: number) {
		this._progressShown = shown;
		if (indeterminate != undefined && indeterminate != null) {
			this._progressIndeterminate = indeterminate;
		}
		if (percentage != undefined && percentage != null) {
			if (percentage >= 0 && percentage <= 100) {
				this._progressPercent = percentage;
			} else {
				throw new Error('Please specify a number for the percentage.');
			}
		}
	}
}
