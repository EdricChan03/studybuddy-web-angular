import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-todo-project',
	templateUrl: './todo-project.component.html'
})
export class TodoProjectComponent implements OnInit {

	constructor(
		private router: Router,
		private route: ActivatedRoute
	) {
		route.params.subscribe(result => {
			if (result.projectId) {
				console.log(`Project ID: ${result.projectId}`);
			}
		})
	}

	ngOnInit() {
	}

}
