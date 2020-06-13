import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { auth, User } from 'firebase/app';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';

import { DialogsService } from '../../core/dialogs/dialogs.service';
import { GapiWrapperService } from '../../gapi-wrapper.service';
import { TodoItem, TodoProject } from '../../interfaces';
import { SharedService } from '../../shared.service';
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
  // Only allow due dates today and after to be selected
  minDueDate = new Date();
  mkdnText = `**Bold**
    _Italics_
    **_Bold + Italics_**
    ~strikethrough~
    [Link](https://google.com)
    [YouTube][test]
    [test]: https://youtube.com'`;
  mkdnLists = `Unordered:
    - List item #1
    - List item #2
    Ordered:
    1. Ordered item #1
    2. Ordered item #2
    3. Ordered item #3`;
  mkdnImg = '![Alternate text](https://example.com/myimg.jpg)';
  mkdnHeaders = `# Header 1
    ## Header 2
    ### Header 3
    #### Header 4
    ##### Header 5
    ###### Header 6`;
  mkdnCode = `\`\`\`
    Code blocks are typically in three backticks (\`)
    \`\`\`
    \`\`\`html
    <p>This is an example of syntax-highlighting! <em>wow</em><p>
    \`\`\``;
  todoForm: FormGroup;
  projectsCollection: AngularFirestoreCollection<TodoProject>;
  projects$: Observable<TodoProject[]>;
  user: User;
  @ViewChild('helpContentDialog', { static: true }) helpContentDialogTmpl: TemplateRef<any>;
  constructor(
    // TODO(Edric): Figure out a way to make this private
    public shared: SharedService,
    private coreDialogs: DialogsService,
    private afAuth: AngularFireAuth,
    private dialogRef: MatDialogRef<TodoDialogComponent>,
    private afFs: AngularFirestore,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private gapiWrapper: GapiWrapperService
  ) {
    this.todoForm = fb.group({
      title: ['', Validators.required],
      content: '',
      // projects: this.fb.array([]),
      // tags: this.fb.array([]),
      dueDate: null,
      isDone: false,
      isArchived: false,
      // TODO: Remove ID property
      id: { value: this.afFs.createId(), disabled: true },
      project: null
    });
    afAuth.user.subscribe(user => {
      this.user = user;
      if (user) {
        this.todoCollection = this.afFs.collection(`users/${user.uid}/todos`);
        this.projectsCollection = this.afFs.collection(`users/${user.uid}/todoProjects`);
        this.projects$ = this.projectsCollection.valueChanges();
      } else {
        // User isn't signed in! Add todo stuff to disable dialog
        const loginDialogRef = this.coreDialogs.openConfirmDialog({
          title: 'Login before continuing',
          isHtml: true,
          msg: `<p>To access this content, please login before continuing.</p>
          <p><strong>Note: Please enable popups before clicking the Login button.</strong></p>`,
          positiveBtnText: 'Login'
        }, {
          disableClose: true
        });
        loginDialogRef.afterClosed().subscribe(result => {
          if (result === 'ok') {
            // tslint:disable-next-line:no-shadowed-variable
            this.gapiWrapper.login();
            // this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
            //   this.shared.openSnackBar({ msg: `Signed in as ${result.user.email}` });
            // }, err => {
            //   this.shared.openSnackBar({ msg: `Error: ${err.message}` });
            // });
          }
          this.dialogRef.close();
        });
      }
    });
  }

  get todoFormRawValue(): any {
    return this.todoForm.getRawValue();
  }

  showHelp(help: 'content' | 'project' | 'dueDate') {
    switch (help) {
      case 'content':
        this.helpDialogRef = this.dialog.open(this.helpContentDialogTmpl);
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
      this.todoForm.patchValue(todoItem);
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
      const itemToAdd: Partial<TodoItem> = {};
      for (const prop in this.todoFormRawValue) {
        if (this.todoFormRawValue.hasOwnProperty(prop) && this.todoFormRawValue[prop] !== null) {
          switch (prop as keyof TodoItem) {
            case 'id':
            case 'isArchived':
            case 'isDone':
            case 'content':
            case 'title':
              itemToAdd[prop] = this.todoFormRawValue[prop];
              break;
            case 'dueDate':
              itemToAdd[prop] = firestore.Timestamp.fromDate(this.todoFormRawValue[prop] as Date);
              break;
            case 'project':
              itemToAdd[prop] = this.afFs.doc(`users/${this.user.uid}/todoProjects/${this.todoFormRawValue[prop]}`).ref;
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
