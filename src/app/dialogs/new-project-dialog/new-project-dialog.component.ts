import { Component, TemplateRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firestore } from 'firebase';

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
  newProjectForm: FormGroup;
  currentUser: string;
  projectsCollection: AngularFirestoreCollection<TodoProject>;
  helpDialogRef: MatDialogRef<any>;
  isEditing = false;
  projectId: string;
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private fs: AngularFirestore,
    public shared: SharedService,
    private fb: FormBuilder
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
        this.projectsCollection = this.fs.collection(`users/${this.currentUser}/todoProjects`);
        if (this.isEditing && this.projectId) {
          this.projectsCollection
            .doc(this.projectId)
            .get()
            .subscribe(result => {
              const data = result.data();
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
          newProject['dueDate'] = firestore.Timestamp.fromDate(this.newProjectForm.value[prop] as Date);
        } else {
          newProject[prop] = this.newProjectForm.value[prop];
        }
      }
    }
    if (!this.isEditing) {
      this.projectsCollection.add(newProject)
        .then(result => {
          this.projectsCollection.doc(result.id).update({ id: result.id })
            .then(() => {
              console.log('Successfully added project\'s ID to project!');
            }, error => {
              this.shared.openSnackBar({
                msg: `An error occurred: ${error.message}`,
                additionalOpts: {
                  duration: 6000
                }
              });
              console.error('An error occurred: ', error.message);
            });
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
      this.projectsCollection.doc(this.projectId)
        .update(newProject)
        .then(() => {
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
