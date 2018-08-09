import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-notes-home',
  templateUrl: './notes-home.component.html',
})
export class NotesHomeComponent implements OnInit {

  constructor(
    private shared: SharedService
  ) {
    shared.title = 'Notes';
  }

  ngOnInit() {
  }

}
