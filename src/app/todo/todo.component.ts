import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-todo',
	templateUrl: './todo.component.html',
	styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
	add = {
		'title': '',
		'content': '',
		'dueDate': ''
	}
	constructor() { }

	cancel() {

	}
	addTodo() {
		
	}
	ngOnInit() {
	}

}
