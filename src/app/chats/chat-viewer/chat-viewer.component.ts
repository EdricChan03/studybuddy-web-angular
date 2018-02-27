import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-chat-viewer',
	templateUrl: './chat-viewer.component.html'
})
export class ChatViewerComponent implements OnInit {

	constructor(private route: ActivatedRoute) {
		route.params.subscribe(result => {
			console.log(result);
		})
	}

	ngOnInit() {
	}

}
