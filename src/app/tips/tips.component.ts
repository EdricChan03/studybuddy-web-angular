import { SharedService } from '../shared.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToolbarService } from '../toolbar.service';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss']
})
export class TipsComponent implements OnInit {

  quoteOfDay: QuoteOfTheDay;
  wordOfDay: WordOfTheDay;
  constructor(
    private http: HttpClient,
    public shared: SharedService,
    private toolbarService: ToolbarService
  ) {
    shared.title = 'Tips';
  }
  showProgress() {
    this.toolbarService.setProgress(true);
  }
  hideProgress() {
    this.toolbarService.setProgress(false);
  }
  /**
   * Gets today's quote of the day
   */
  getQuoteOfDay(enableDebug?: boolean) {
    this.showProgress();
    this.http.get('https://quotes.rest/qod')
      .subscribe(result => {
        this.hideProgress();
        this.quoteOfDay = <QuoteOfTheDay>result;
        if (enableDebug) {
          console.log('[DEBUG] Result of quote of the day:', result);
        }
      }, error => this._handleHttpError(error));
  }
  /**
   * Gets today's word of the day
   */
  getWordOfDay(enableDebug?: boolean) {
    this.showProgress();
    this.http.get('http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
      .subscribe(result => {
        this.hideProgress();
        this.wordOfDay = <WordOfTheDay>result;
        if (enableDebug) {
          console.log('[DEBUG] Result of quote of the day:', result);
        }
      }, error => this._handleHttpError(error));
  }
  private _handleHttpError(error: {message: string}) {
    this.hideProgress();
    this.shared.openSnackBar({
      msg: `Error: ${error.message}`,
      additionalOpts: { duration: 6000 }
    });
    console.error('Error: ', error.message);
  }
  ngOnInit() {
    if (this.shared.isOnline) {
      this.getWordOfDay();
      this.getQuoteOfDay();
    }
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
