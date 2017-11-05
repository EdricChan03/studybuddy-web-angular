import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
	selector: 'app-resources',
	templateUrl: './resources.component.html'
})
export class ResourcesComponent implements OnInit {

	wordOfDay: any;
	constructor(private http: Http) { }

	/**
	 * Gets today's word of the day
	 */
	getWordOfDay() {
		this.http.get('http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5').map(res => res.json())
		.subscribe(result => {
			this.wordOfDay = <WordOfTheDay> result;
		})
	}
	ngOnInit() {
		this.getWordOfDay();
	}

}

interface WordOfTheDay {
	word: string;
	definitions: WordOfTheDayDefinitions[];
	examples: WordOfTheDayExamples[];
}
interface WordOfTheDayDefinitions {
	text: string;
	note?: string;
	partOfSpeech: string;
}
interface WordOfTheDayExamples {
	text: string;
	title: string;
}