import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-appdownloads',
  templateUrl: './appdownloads.component.html'
})
export class AppDownloadsComponent implements OnInit {

  constructor(
    private shared: SharedService
  ) {
    shared.title = 'App downloads';
  }

  ngOnInit() {
  }

}
