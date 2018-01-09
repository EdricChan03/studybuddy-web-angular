import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-resources',
	templateUrl: './resources.component.html'
})
export class ResourcesComponent implements OnInit {

	quoteOfDay: QuoteOfTheDay;
	wordOfDay: WordOfTheDay;
	constructor(private http: HttpClient) { }

	/**
	 * Gets today's quote of the day
	 */
	getQuoteOfDay(enableDebug?: boolean) {
		this.http.get('https://quotes.rest/qod')
			.subscribe(result => {
				this.quoteOfDay = <QuoteOfTheDay> result;
				if (enableDebug) {
					console.debug(`[DEBUG] Result of quote of the day: ${result}`);
				}
			});
	}
	/**
	 * Gets today's word of the day
	 */
	getWordOfDay() {
		this.http.get('http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
		.subscribe(result => {
			this.wordOfDay = <WordOfTheDay> result;
		});
	}
	ngOnInit() {
		this.getWordOfDay();
		this.getQuoteOfDay();
	}

}
interface QuoteOfTheDay {
	contents: QuoteOfTheDayContents;
}
interface QuoteOfTheDayContents {
	quotes: QuoteOfTheDayQuotes[];
}
interface QuoteOfTheDayQuotes {
	quote: string;
	author: string;
	tags?: string[];
	date?: Date | string | any;
	title?: string;
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