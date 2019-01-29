
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { NewProjectDialogComponent } from '../../dialogs';
import { TodoProject } from '../../interfaces';
import { SharedService } from '../../shared.service';
import { ToolbarService } from '../../toolbar.service';

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
  projectsCollection: AngularFirestoreCollection<TodoProject>;
  constructor(
    private authService: AuthService,
    private toolbarService: ToolbarService,
    private shared: SharedService,
    private fs: AngularFirestore,
    private dom: DomSanitizer,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    route.queryParams.pipe(
      filter(params => params.new)).
      subscribe(params => {
        if (params.new) {
          router.navigate(['/todo/dashboard-new']);
        }
      });
    shared.title = 'Todo Dashboard';
    this.authService.getAuthState().subscribe((user) => {
      if (user) {
        console.log(user);
        this.currentUser = user.uid;
        this.projectsCollection = this.fs.collection(`users/${this.currentUser}/todoProjects`, ref => ref.orderBy('name'));
        this.projects$ = this.projectsCollection
          .snapshotChanges().pipe(map(result => {
            return result.map(a => {
              const data = a.payload.doc.data() as TodoProject;
              if (!data.hasOwnProperty('id')) {
                data.id = a.payload.doc.id;
              }
              // Check if color property exists
              data.color = a.payload.doc.data().color ? a.payload.doc.data().color : '#000000';
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
  get isMobile(): boolean {
    return this.shared.isMobile;
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
    this.projectsCollection.doc(project.id).delete().then(() => {
      const snackBarRef = this.shared.openSnackBar({ msg: 'Successfully deleted project!', action: 'Undo' });
      snackBarRef.onAction().subscribe(() => {
        this.projectsCollection.doc(project.id).set(project)
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
    // tslint:disable-next-line:max-line-length
    let dialogText = '<p>Are you sure you want to delete the project? Once deleted, it will be forever lost and cannot be retrieved again.</p>';
    if (showHint) {
      dialogText += '<p><small>TIP: To bypass this dialog, hold the shift key when clicking the delete button.</small></p>';
    }
    const dialogRef = this.shared.openConfirmDialog({
      msg: this.dom.bypassSecurityTrustHtml(dialogText),
      title: 'Delete project?',
      isHtml: true,
      ok: 'Delete',
      okColor: 'warn'
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
