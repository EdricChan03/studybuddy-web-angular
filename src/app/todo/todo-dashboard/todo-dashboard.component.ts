
import { animate, keyframes, query, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { collection, collectionData, CollectionReference, deleteDoc, doc, Firestore, query as fsQuery, orderBy, setDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { NewProjectDialogComponent } from '../../dialogs';
import { TodoProject } from '../../interfaces';
import { SharedService } from '../../shared.service';
import { ToolbarService } from '../../toolbar.service';
import { DialogsService } from '../../core/dialogs/dialogs.service';

@Component({
  selector: 'app-todo-dashboard',
  templateUrl: './todo-dashboard.component.html',
  styleUrls: ['./todo-dashboard.component.scss'],
  animations: [
    trigger('todoProjectUpdateAnim', [
      transition(':enter', [
        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', keyframes([
          style({ 'background-color': '*', offset: 0 }),
          style({ 'background-color': '#fff3e0', offset: 0.25 }),
          style({ 'background-color': '#fff3e0', offset: 0.75 }),
          style({ 'background-color': '*', offset: 1 })
        ])
        )]
      )])
  ]
})
export class TodoDashboardComponent implements OnInit {
  currentUser: string;
  projects$: Observable<TodoProject[]>;
  projectsCollection: CollectionReference<TodoProject>;
  constructor(
    private coreDialogs: DialogsService,
    private authService: AuthService,
    private toolbarService: ToolbarService,
    private shared: SharedService,
    private fs: Firestore,
    private dom: DomSanitizer,
    private dialog: MatDialog
  ) {
    shared.title = 'Todo Dashboard';
    this.authService.getAuthState().subscribe((user) => {
      if (user) {
        console.log(user);
        this.currentUser = user.uid;
        this.projectsCollection = collection(fs, `users/${this.currentUser}/todoProjects`) as CollectionReference<TodoProject>;
        const projectsData = fsQuery(
          this.projectsCollection,
          orderBy('name')
        );
        this.projects$ = collectionData(projectsData, { idField: 'id' }).pipe(map(result => {
            return result.map(data => {
              // Check if color property exists
              data.color = data.color ? data.color : '#000000';
              return data;
            });
          }));
        this.projects$.subscribe(() => {
          this.toolbarService.setProgress(false);
        });
      } else {
        console.warn('Current user doesn\'t exist yet!');
      }
    });
  }

  getRandomColor(): string {
    return this.shared.getRandomColor();
  }
  newProject() {
    this.dialog.open(NewProjectDialogComponent);
  }
  editProject(project: TodoProject, event?: KeyboardEvent) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(NewProjectDialogComponent);
    dialogRef.componentInstance.isEditing = true;
    dialogRef.componentInstance.projectId = project.id;
  }
  deleteProject(project: TodoProject) {
    const projectDoc = doc(this.projectsCollection, project.id);
    deleteDoc(projectDoc).then(() => {
      const snackBarRef = this.shared.openSnackBar({ msg: 'Successfully deleted project!', action: 'Undo' });
      snackBarRef.onAction().subscribe(() => {
        setDoc(projectDoc, project)
          .then(() => {
            console.log('Successfully undone deletion!');
          })
          .catch((error) => {
            console.error(`An error occurred: ${error.message}`);
            this.shared.openSnackBar({ msg: `An error occurred: ${error.message}` });
          });
      });
    })
      .catch((error) => {
        this.shared.openSnackBar({ msg: `Error: ${error.message}` });
      });
  }
  removeProject(project: TodoProject, bypassDialog?: boolean, event?: KeyboardEvent) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
      // Check if shift key is pressed
      if (event.shiftKey || bypassDialog) {
        this.deleteProject(project);
      } else {
        // Show confirmation dialog
        this.deleteConfirmDialog(project);
      }
    } else {
      this.deleteConfirmDialog(project);
    }
  }
  deleteConfirmDialog(project: TodoProject, showHint: boolean = true) {
    // eslint-disable-next-line max-len
    let dialogText = '<p>Are you sure you want to delete the project? Once deleted, it will be forever lost and cannot be retrieved again.</p>';
    if (showHint) {
      dialogText += '<p><small>TIP: To bypass this dialog, hold the shift key when clicking the delete button.</small></p>';
    }
    const dialogRef = this.coreDialogs.openConfirmDialog({
      msg: this.dom.bypassSecurityTrustHtml(dialogText),
      title: 'Delete project?',
      isHtml: true,
      positiveBtnText: 'Delete',
      positiveBtnColor: 'warn'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.deleteProject(project);
      }
    });
  }
  ngOnInit() {
    this.toolbarService.setProgress(true, true);
  }
}
