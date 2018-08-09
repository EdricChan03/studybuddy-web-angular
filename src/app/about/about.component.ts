import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {

  constructor(
    private shared: SharedService
  ) {
    shared.title = 'About';
  }

  ngOnInit() {
  }

  testChange(e) {
    console.log(e);
  }
}
