import { Component, OnInit } from '@angular/core';
import { TodoItem } from '../interfaces';
import { SharedService } from '../shared.service';

interface Dashboard {
	todos: TodoItem[];
	notes: any;
}
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

	constructor(
		private shared: SharedService
	) {
		shared.title = 'Dashboard';
	}
	dashboard: Dashboard = {
		todos: [
			{
				title: 'Todo #1',
				dueDate: new Date(),
				tags: ['tag-1', 'my-tag'],
				content: 'Content goes here'
			},
			{
				title: 'Todo #2',
				dueDate: new Date(),
				tags: ['tag-1', 'my-tag'],
				content: '# Content goes here'
			 	+ '\n**Bold**'
				+ '\n_Italics_'
				+ '\n~Strikethrough~'
				+ '\n**_Bold + Italics_**'
				+ '\n> I\'m a cool blockquote! XD Check out the code for more info.'
				+ '\n\n```css'
				+ '\n@import \'~@angular/material/prebuilt-themes/indigo-pink.css\''
				+ '\n```'
			},
			{
				title: 'Todo #3',
				dueDate: new Date(),
				tags: ['tag-1', 'my-tag'],
				content: 'Content goes here'
			},
			{
				title: 'Todo #4',
				dueDate: new Date(),
				tags: ['tag-1', 'my-tag'],
				content: 'Content goes here'
			}
		],
		notes: [
			{

			}
		]
	}
	ngOnInit() {
	}

}
