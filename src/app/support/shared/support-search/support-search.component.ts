import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-support-search',
  templateUrl: './support-search.component.html',
  styleUrls: ['./support-search.component.scss']
})
export class SupportSearchComponent {

  keywords: string = '';
  isInputFocused = false;

  /**
   * Event emitted when the `keywords` value changes
   */
  @Output() readonly keywordsChange: EventEmitter<string> = new EventEmitter<string>();
  /**
   * Whether to allow blurring of the search input
   */
  @Input() blur: boolean = true;
  /**
   * Whether to enable type to search
   */
  @Input() typeToSearch: boolean = false;
  /**
   * Whether to show a clear button
   */
  @Input() showClearBtn: boolean = true;
  onInputChange() {
    this.keywordsChange.emit(this.keywords);
  }
}
