import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared.service';

@Component({
	selector: 'app-note-not-found',
	templateUrl: './note-not-found.component.html',
})
export class NoteNotFoundComponent implements OnInit {

	constructor(
		private shared: SharedService
	) {
		shared.title = 'Note not found';
	}

	ngOnInit() {
	}

}
