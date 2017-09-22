import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';
	sidenavLinks = [
		{
			link: 'home',
			title: 'Home',
			icon: 'home'
		},
		{
			link: 'downloads',
			title: 'App Downloads',
			icon: 'apps'
		},
		{
			link: 'todo',
			title: 'Todos',
			icon: 'check_circle'
		}
	]
}
