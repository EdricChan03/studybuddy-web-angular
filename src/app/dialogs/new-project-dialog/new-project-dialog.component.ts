import { Component, TemplateRef } from '@angular/core';
import { TodoProject } from '../../interfaces';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs';
import { SharedService } from '../../shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'new-project-dialog',
  templateUrl: './new-project-dialog.component.html'
})
export class NewProjectDialogComponent {
  colorError = '';
  options: FormGroup;
  currentUser: string;
  projectsCollection: AngularFirestoreCollection<TodoProject>;
  helpDialogRef: MatDialogRef<any>;
  constructor(
    private authService: AuthService,
    private fs: AngularFirestore,
    private shared: SharedService,
    private fb: FormBuilder
  ) {
    this.options = fb.group({
      'name': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      'color': ['#000000', [Validators.required, Validators.pattern(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)]]
    });
    this.authService.getAuthState().subscribe((user) => {
      if (user) {
        console.log(user);
        this.currentUser = user.uid;
        this.projectsCollection = this.fs.collection(`users/${this.currentUser}/todoProjects`);
      } else {
        console.warn('Current user doesn\'t exist yet!');
      }
    });
  }
  onClose() {
    this.projectsCollection.add({
      name: this.options.get('name').value,
      color: this.options.get('color').value
    }).then(result => {
      this.shared.openSnackBar({
        msg: 'Project was added',
        additionalOpts: {
          duration: 5000
        }
      });
      console.log(`Successfully written data with result: ${result}`);
    }, error => {
      this.shared.openSnackBar({
        msg: `An error occured: ${error.message}`,
        additionalOpts: {
          duration: 6000
        }
      });
      console.error(`An error occured: ${error.message}`);
    });
  }
  showHelpDialog(templateRef: TemplateRef<any>) {
    this.helpDialogRef = this.shared.openHelpDialog(templateRef);
  }
  closeHelpDialog() {
    this.helpDialogRef.close();
    this.helpDialogRef = null;
  }
}
