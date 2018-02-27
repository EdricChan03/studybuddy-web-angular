import { Chat } from '../interfaces';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-chats',
	templateUrl: './chats.component.html'
})
export class ChatsComponent implements OnInit {

	constructor() { }
	chats: Chat[];
	ngOnInit() {
		this.chats = [
			{
				createdAt: new Date(),
				people: ['lorem.ipsum@ipsum.com', 'wowsuchacct@wow.com'],
				id: 'gerg4r43ndfverveg',
				name: 'Physics Revision Group',
				owner: 'wowsuchacct@wow.com'
			},
			{
				// 3 December 2017
				createdAt: new Date(2017, 12, 3),
				lastModified: new Date(),
				people: ['anotheraccountgoeshere@ipsum.com', 'wowsuchacct@wow.com', 'xdxd@xd.com'],
				id: 'gerg4r43ndfverveg',
				name: 'Gaming shit AF',
				owner: 'wowsuchacct@wow.com',
				notifications: 10
			}
		];
	}

}
