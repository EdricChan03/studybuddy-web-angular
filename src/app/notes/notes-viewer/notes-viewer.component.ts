import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-notes-viewer',
	templateUrl: './notes-viewer.component.html',
	styles: []
})
export class NotesViewerComponent implements OnInit {

	constructor(private route: ActivatedRoute) {
		route.params.subscribe(result => {
			console.log(`Route params: ${result}`);
		})
	}

	ngOnInit() {
	}

}
