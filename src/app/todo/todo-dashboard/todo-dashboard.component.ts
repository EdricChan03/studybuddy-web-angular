import { ToolbarService } from '../../toolbar.service';
import { Component } from '@angular/core';

@Component({
	selector: 'app-todo-dashboard',
	templateUrl: './todo-dashboard.component.html'
})
export class TodoDashboardComponent {

	get sidenavStyle(): string {
		return `calc(100% - ${document.getElementById('topToolbar').clientHeight.toString()})`;
	}
	constructor(
		public toolbarService: ToolbarService
	) { }

	toggleToolbar(toggleTo?: boolean) {
		if (!!toggleTo) {
			this.toolbarService.showToolbar = toggleTo;
		} else {
			this.toolbarService.showToolbar = !this.toolbarService.showToolbar;
		}
		console.log(this.toolbarService.showToolbar);
	}

}
