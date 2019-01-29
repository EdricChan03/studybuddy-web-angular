import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth';
import { SharedService } from '../../shared.service';
import { TodoItem, TodoProject } from '../../interfaces';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EditContentDialogComponent } from '../edit-content-dialog/edit-content-dialog.component';
import { MatChipInputEvent } from '@angular/material';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { NewProjectDialogComponent } from '../new-project-dialog/new-project-dialog.component';

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss']
})
export class TodoDialogComponent implements OnInit {
  todoItem: TodoItem;
  isNewTodo = true;
  todoToEdit: TodoItem;
  todoCollection: AngularFirestoreCollection<TodoItem>;
  enableTags = false;
  showDebug = false;
  helpDialogRef: MatDialogRef<any>;
  mkdnText = '**Bold**\n' +
    '_Italics_\n' +
    '**_Bold + Italics_**\n' +
    '~strikethrough~\n' +
    '[Link](https://google.com)\n' +
    '[YouTube][test]\n\n' +
    '[test]: https://youtube.com';
  mkdnLists = 'Unordered:\n' +
    '- List item #1\n' +
    '- List item #2\n' +
    'Ordered:\n' +
    '1. Ordered item #1\n' +
    '2. Ordered item #2\n' +
    '3. Ordered item #3';
  mkdnImg = '![Alternate text](https://example.com/myimg.jpg)';
  mkdnHeaders = '# Header 1\n' +
    '## Header 2\n' +
    '### Header 3\n' +
    '#### Header 4\n' +
    '##### Header 5\n' +
    '###### Header 6';
  mkdnCode = '```\n' +
    'Code blocks are typically in three backticks (\`)\n' +
    '```\n' +
    '```html\n' +
    '<p>This is an example of syntax-highlighting! <em>wow</em><p>\n' +
    '```';
  todoForm: FormGroup;
  projectsCollection: AngularFirestoreCollection<TodoProject>;
  projects$: Observable<TodoProject[]>;
  @ViewChild('helpContentDialog') helpContentDialogTmpl: TemplateRef<any>;
  constructor(
    // TODO(Edric): Figure out a way to make this private
    public shared: SharedService,
    private afAuth: AngularFireAuth,
    private dialogRef: MatDialogRef<TodoDialogComponent>,
    private afFs: AngularFirestore,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.todoForm = fb.group({
      title: ['', Validators.required],
      content: '',
      // projects: this.fb.array([]),
      // tags: this.fb.array([]),
      dueDate: null,
      isDone: false,
      id: { value: this.afFs.createId(), disabled: true },
      project: null
    });
    if (afAuth.auth.currentUser) {
      this.todoCollection = this.afFs.collection(`users/${afAuth.auth.currentUser.uid}/todos`);
      this.projectsCollection = this.afFs.collection(`users/${afAuth.auth.currentUser.uid}/todoProjects`);
      this.projects$ = this.projectsCollection.valueChanges();
    } else {
      // User isn't signed in! Add todo stuff to disable dialog
      const loginDialogRef = this.shared.openConfirmDialog({
        title: 'Login before continuing',
        disableClose: true,
        isHtml: true,
        msg: `<p>To access this content, please login before continuing.</p>
        <p><strong>Note: Please enable popups before clicking the Login button.</strong></p>`,
        ok: 'Login'
      });
      loginDialogRef.afterClosed().subscribe(result => {
        if (result === 'ok') {
          // tslint:disable-next-line:no-shadowed-variable
          this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
            this.shared.openSnackBar({ msg: `Signed in as ${result.user.email}` });
          }, err => {
            this.shared.openSnackBar({ msg: `Error: ${err.message}` });
          });
        }
        this.dialogRef.close();
      });
    }
  }
  get isMobile(): boolean {
    return this.shared.isMobile;
  }
  get todoFormRawValue(): any {
    return this.todoForm.getRawValue();
  }
  /** @deprecated The document ID is automatically generated */
  regenerateId() {
    this.todoForm.get('id').setValue(this.afFs.createId());
  }
  showHelp(help: 'content' | 'project' | 'dueDate') {
    switch (help) {
      case 'content':
        this.helpDialogRef = this.shared.openHelpDialog(this.helpContentDialogTmpl);
        break;
    }
  }
  closeHelpDialog() {
    this.helpDialogRef.close();
    this.helpDialogRef = null;
  }
  /*addTag(event: MatChipInputEvent, type: 'tags' | 'projects') {
    let input = event.input;
    let value = event.value;

    // Add a tag
    if ((value || '').trim()) {
      switch (type) {
        case 'tags':
          this.tagsArray.push(value);
          break;
        case 'projects':
          this.projectsArray.push(value);
          break;
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  removeTag(tag: string, type: 'tags' | 'projects') {
    let index: number;
    switch (type) {
      case 'tags':
        index = this.tagsArray.value.indexOf(tag);
        break;
      case 'projects':
        index = this.projectsArray.value.indexOf(tag);
        break;
    }
    if (index >= 0) {
      switch (type) {
        case 'tags':
          this.tagsArray.value.splice(index, 1);
          break;
        case 'projects':
          this.projectsArray.value.splice(index, 1);
          break;
      }
    }
  }
  editContent() {
    this.dialog.open(EditContentDialogComponent, { disableClose: true, panelClass: 'no-padding' });
  }*/
  ngOnInit() {
    if (!this.isNewTodo) {
      const todoItem: any = Object.assign({}, this.todoToEdit);
      if ('dueDate' in todoItem) {
        todoItem.dueDate = todoItem.dueDate.toDate();
      } else {
        todoItem.dueDate = null;
      }
      this.todoForm.setValue(todoItem);
    }
  }
  resetForm() {
    this.todoForm.reset();
  }
  cancel() {
    this.dialogRef.close();
  }
  /*checkWhitespace(typeToCheck: 'content' | 'title') {
    switch (typeToCheck) {
      case 'content':
        this.todoItem.content = this.todoItem.content.replace(/^\s+/, '').replace(/\s+$/, '');
        break;
      case 'title':
        this.todoItem.title = this.todoItem.title.replace(/^\s+/, '').replace(/\s+$/, '');
        break;
    }
  }*/
  createProject() {
    this.dialog.open(NewProjectDialogComponent);
  }
  saveOrAddTodo() {
    if (this.isNewTodo) {
      const itemToAdd: TodoItem = { title: '' };
      for (const prop in this.todoFormRawValue) {
        if (this.todoFormRawValue.hasOwnProperty(prop) && this.todoFormRawValue[prop] !== null) {
          switch (prop) {
            case 'id':
            case 'isDone':
            case 'content':
            case 'title':
              itemToAdd[prop] = this.todoFormRawValue[prop];
              break;
            case 'dueDate':
              itemToAdd.dueDate = firebase.firestore.Timestamp.fromDate(this.todoFormRawValue[prop] as Date);
              break;
            case 'project':
              itemToAdd[prop] = this.afFs.doc(`users/${this.afAuth.auth.currentUser.uid}/todoProjects/${this.todoFormRawValue[prop]}`).ref;
              break;
            default:
              throw new Error(`Property ${prop} doesn't exist!`);
          }
        }
      }
      this.todoCollection.doc(itemToAdd.id).set(itemToAdd).then(result => {
        this.shared.openSnackBar({ msg: 'Todo was added' });
        console.log(`Successfully written data with result: ${result}`);
      }, error => {
        this.shared.openSnackBar({
          msg: `An error occurred: ${error.message}`,
          additionalOpts: {
            duration: 6000
          }
        });
        console.error(`An error occurred: ${error.message}`);
      });
    } else {
      this.todoCollection.doc<TodoItem>(this.todoToEdit.id)
        .update(this.todoFormRawValue)
        .then(result => {
          this.shared.openSnackBar({
            msg: 'Successfully updated todo!'
          });
          console.log(`Successfully updated data with result: ${result}`);
        }, error => {
          this.shared.openSnackBar({
            msg: `An error occurred: ${error.message}`,
            additionalOpts: { duration: 6000 }
          });
          console.error(`An error occurred: ${error.message}`);
        });
    }
    this.dialogRef.close();
  }
}
