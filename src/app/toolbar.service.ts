import { Injectable } from '@angular/core';

@Injectable()
export class ToolbarService {
	/**
	 * Whether to show the toolbar
	 * @type {boolean}
	 */
	private _toolbarShown: boolean = true;
	constructor() { }
	set showToolbar(value: boolean) {
		this._toolbarShown = value;
	}
	get showToolbar() {
		return this._toolbarShown;
	}
}
