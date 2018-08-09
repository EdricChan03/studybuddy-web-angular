import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-cheatsheet-home',
  templateUrl: './cheatsheet-home.component.html',
})
export class CheatsheetHomeComponent implements OnInit {

  constructor(
    private shared: SharedService
  ) {
    shared.title = 'Cheatsheets';
  }

  ngOnInit() {
  }

}
