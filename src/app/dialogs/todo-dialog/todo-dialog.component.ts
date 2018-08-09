import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from 'angularfire2/auth';
import { SharedService } from '../../shared.service';
import { TodoItem } from '../../interfaces';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EditContentDialogComponent } from '../edit-content-dialog/edit-content-dialog.component';
import { MatChipInputEvent } from '@angular/material';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

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
      hasDone: false,
      id: this.afFs.createId()
    });
    if (afAuth.auth.currentUser) {
      this.todoCollection = this.afFs.collection(`users/${afAuth.auth.currentUser.uid}/todos`);
    } else {
      // User isn't signed in! Add todo stuff to disable dialog
      // tslint:disable-next-line:max-line-length
      const loginDialogRef = this.shared.openConfirmDialog({ title: 'Login before continuing', disableClose: true, isHtml: true, msg: '<p>To access this content, please login before continuing.</p><p>If you believe that this is an error and that you are already signed in, DM me on Twitter at @EdricChan03.</p><p><strong>Note: Please enable popups before clicking the Login button. This will be the only time popups will show.</strong></p>', ok: 'Login' });
      loginDialogRef.afterClosed().subscribe(result => {
        if (result === 'ok') {
          this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((a) => {
            // tslint:disable-next-line:max-line-length
            this.shared.openSnackBar({ msg: `Signed in as ${a.user.email}`, additionalOpts: { duration: 4000, horizontalPosition: 'start', panelClass: 'mat-elevation-z3' } });
          }, err => {
            // tslint:disable-next-line:max-line-length
            this.shared.openSnackBar({ msg: `Error: ${err.message}`, additionalOpts: { duration: 4000, horizontalPosition: 'start', panelClass: 'mat-elevation-z3' } });
          });
        }
        this.dialogRef.close();
      });
    }
  }
  get isMobile(): boolean {
    return this.shared.isMobile;
  }
  get projectsArray(): FormArray {
    return this.todoForm.get('projects') as FormArray;
  }
  get tagsArray(): FormArray {
    return this.todoForm.get('tags') as FormArray;
  }
  get todoFormRawValue(): any {
    return this.todoForm.getRawValue();
  }
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
  saveOrAddTodo() {
    if (this.isNewTodo) {
      const itemToAdd: TodoItem = {title: ''};
      for (const prop in this.todoFormRawValue) {
        if (this.todoFormRawValue.hasOwnProperty(prop) && this.todoFormRawValue[prop] !== null) {
          switch (prop) {
            case 'title':
              itemToAdd.title = this.todoFormRawValue[prop];
              break;
            case 'content':
              itemToAdd.content = this.todoFormRawValue[prop];
              break;
            case 'dueDate':
              console.log(this.todoFormRawValue[prop]);
              itemToAdd.dueDate = firebase.firestore.Timestamp.fromDate(this.todoFormRawValue[prop] as Date);
              break;
            case 'hasDone':
              console.log(this.todoFormRawValue[prop]);
              itemToAdd.hasDone = this.todoFormRawValue[prop];
              break;
            case 'id':
              itemToAdd.id = this.todoFormRawValue[prop];
              break;
            default:
              throw new Error(`Property ${prop} doesn't exist!`);
          }
        }
      }
      this.todoCollection.doc(itemToAdd.id).set(itemToAdd).then(result => {
        // tslint:disable-next-line:max-line-length
        this.shared.openSnackBar({ msg: 'Todo was added', additionalOpts: { duration: 5000, panelClass: 'mat-elevation-z3', horizontalPosition: 'start' } });
        console.log(`Successfully written data with result: ${result}`);
      }, error => {
        // tslint:disable-next-line:max-line-length
        this.shared.openSnackBar({ msg: `An error occured: ${error.message}`, additionalOpts: { duration: 6000, horizontalPosition: 'start' }, hasElevation: true });
        console.error(`An error occured: ${error.message}`);
      });
    } else {
      this.todoCollection.doc<TodoItem>(this.todoToEdit.id)
        .update(this.todoFormRawValue)
        .then(result => {
          // tslint:disable-next-line:max-line-length
          this.shared.openSnackBar({ msg: 'Todo was updated', additionalOpts: { duration: 5000, horizontalPosition: 'start' }, hasElevation: true });
          console.log(`Successfully updated data with result: ${result}`);
        }, error => {
          // tslint:disable-next-line:max-line-length
          this.shared.openSnackBar({ msg: `An error occured: ${error.message}`, additionalOpts: { duration: 6000, horizontalPosition: 'start' }, hasElevation: true });
          console.error(`An error occured: ${error.message}`);
        });
    }
    this.dialogRef.close();
  }
}
