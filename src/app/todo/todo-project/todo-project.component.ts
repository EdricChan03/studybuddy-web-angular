import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { TodoProject } from '../../interfaces';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { ToolbarService } from '../../toolbar.service';

@Component({
  selector: 'app-todo-project',
  templateUrl: './todo-project.component.html'
})
export class TodoProjectComponent {
}
