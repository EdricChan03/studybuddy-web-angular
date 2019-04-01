import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-user-viewer',
  templateUrl: './user-viewer.component.html'
})
export class UserViewerComponent implements OnInit {

  userId: string;
  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) {
    route.params
      .pipe(
        filter(params => params.userId)
      )
      .subscribe(params => {
        this.userId = params.userId;
        console.log(this.userId);
      });
  }

  ngOnInit() {
    this.api.getUserById(this.userId)
      .subscribe(user => {
        console.log(user);
      })
  }

}
