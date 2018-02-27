import { Injectable } from '@angular/core';

@Injectable()
export class SupportItems {
	private _supportItems: SupportItem[];
	getSupportItems(): SupportItem[] {
		return this._supportItems;
	}
	getSupportItemById(id: string): SupportItem {
		return this._supportItems.find((value: SupportItem) => value.id === id);
	}
}

export interface SupportItem {
	name: string;
	id: string;
}