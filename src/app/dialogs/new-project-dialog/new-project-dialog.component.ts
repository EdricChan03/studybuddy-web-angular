import { Component, TemplateRef } from '@angular/core';
import { addDoc, collection, CollectionReference, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from '@firebase/firestore';

import { AuthService } from '../../auth.service';
import { TodoProject } from '../../interfaces';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-new-project-dialog',
  templateUrl: './new-project-dialog.component.html',
  styles: [
    `
    .icon-additional-selection-trigger {
      opacity: 0.75;
      font-size: 0.75em;
    }
    `
  ]
})
export class NewProjectDialogComponent {
  colorError = '';
  newProjectForm: UntypedFormGroup;
  currentUser: string;
  projectsCollection: CollectionReference<TodoProject>;
  helpDialogRef: MatDialogRef<any>;
  isEditing = false;
  projectId: string;
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private fs: Firestore,
    public shared: SharedService,
    private fb: UntypedFormBuilder
  ) {
    this.newProjectForm = fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      color: [shared.getRandomColor(), [Validators.required, Validators.pattern(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)]],
      dueDate: null,
      icon: null
    });
    this.authService.getAuthState().subscribe((user) => {
      if (user) {
        console.log(user);
        this.currentUser = user.uid;
        this.projectsCollection = collection(fs, `users/${this.currentUser}/todoProjects`) as CollectionReference<TodoProject>;
        if (this.isEditing && this.projectId) {
          docData(
            doc(this.projectsCollection, this.projectId)
          ).subscribe(data => {
              for (const prop in data) {
                if (prop === 'dueDate') {
                  this.newProjectForm.patchValue({ [prop]: data[prop].toDate() });
                } else {
                  this.newProjectForm.patchValue({ [prop]: data[prop] });
                }
              }
            });
        }
      } else {
        console.warn('Current user doesn\'t exist yet!');
      }
    });
  }
  onClose() {
    const newProject: TodoProject = {
      name: null
    };
    for (const prop in this.newProjectForm.value) {
      if (this.newProjectForm.value[prop]) {
        if (prop === 'dueDate') {
          newProject['dueDate'] = Timestamp.fromDate(this.newProjectForm.value[prop] as Date);
        } else {
          newProject[prop] = this.newProjectForm.value[prop];
        }
      }
    }
    if (!this.isEditing) {
      addDoc(
        this.projectsCollection,
        newProject
      ).then(result => {
        this.shared.openSnackBar({ msg: 'Successfully created project!' });
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
      updateDoc(
        doc(this.projectsCollection, this.projectId),
        newProject
      ).then(() => {
          this.shared.openSnackBar({ msg: 'Successfully updated project!' });
        })
        .catch((error) => {
          this.shared.openSnackBar({ msg: `An error occurred: ${error.message}` });
        });
    }
  }

  showHelpDialog(templateRef: TemplateRef<any>) {
    this.helpDialogRef = this.dialog.open(templateRef);
  }

  closeHelpDialog() {
    this.helpDialogRef.close();
    this.helpDialogRef = null;
  }
}
