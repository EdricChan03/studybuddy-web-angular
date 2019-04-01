import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {

  keywords = '';
  isInputFocused = false;

  /**
   * Event emitted when the `keywords` value changes
   */
  @Output() readonly keywordsChange: EventEmitter<string> = new EventEmitter<string>();
  /**
   * Whether to allow blurring of the search input
   */
  @Input() blur = true;
  /**
   * Whether to enable type to search
   */
  @Input() typeToSearch = false;
  /**
   * Whether to show a clear button
   */
  @Input() showClearBtn = true;
  /** Placeholder for the input */
  @Input() placeholder = 'Search everything';
  onInputChange() {
    this.keywordsChange.emit(this.keywords);
  }
}
