import { Component } from '@angular/core';

@Component({
	selector: 'todo-dashboard-new',
	templateUrl: './todo-dashboard-new.component.html',
	styleUrls: ['./todo-dashboard-new.component.css']
})
export class TodoDashboardNewComponent {
	cards = [
		{ title: 'Card 1', cols: 2, rows: 1 },
		{ title: 'Card 2', cols: 1, rows: 1 },
		{ title: 'Card 3', cols: 1, rows: 2 },
		{ title: 'Card 4', cols: 1, rows: 1 }
	];
}
