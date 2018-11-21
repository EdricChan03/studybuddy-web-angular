import { Component } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
})
export class AboutComponent {

  constructor(
    private shared: SharedService
  ) {
    shared.title = 'About';
  }

  testChange(e) {
    console.log(e);
  }
}
