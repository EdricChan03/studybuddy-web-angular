import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import * as schema from '../../../../assets/json-schema/quiz-formly-schema.json';
import { SharedService } from '../../../shared.service';
import { Quiz } from '../quiz-list/model/quiz';
import { firestore } from 'firebase';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html'
})
export class CreateQuizComponent implements OnInit {
  quizzesCollection: AngularFirestoreCollection<Quiz>;
  form = new FormGroup({});
  fields = [this.formlyJsonSchema.toFieldConfig(schema.schema)];
  model = {};
  user: firebase.User;

  constructor(
    private afAuth: AngularFireAuth,
    private afFs: AngularFirestore,
    private formlyJsonSchema: FormlyJsonschema,
    private shared: SharedService
  ) {
    shared.title = 'Create quiz';
    this.quizzesCollection = afFs.collection('quizzes');
    this.afAuth.user.subscribe(user => this.user = user);
  }

  ngOnInit() {
  }

  submit() {
    this.quizzesCollection.add({
      ...this.model,
      author: this.afFs.doc(`users/${this.user.uid}`).ref,
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastModified: firestore.FieldValue.serverTimestamp()
    } as any).then(doc => {
      const snackBarRef = this.shared.openSnackBar({
        msg: 'Successfully submitted quiz!',
        action: 'Undo'
      });
      snackBarRef.onAction().subscribe(() => {
        this.deleteDoc(doc);
      });
    }).catch(error => {
      const snackBarRef = this.shared.openSnackBar({
        msg: `Could not submit quiz: ${error.message}`,
        action: 'Try again',
        config: {
          duration: 6000
        }
      });
      snackBarRef.onAction().subscribe(() => { this.submit(); });
    });
  }

  // Utility method to show snackbar for deletion of document
  private deleteDoc(doc: firestore.DocumentReference,
    snackBarMessage: string = 'Successfully undone submission of quiz.',
    undoSnackBarMessage: string = 'Could not undo submission of quiz:',
    undoSnackBarAction: string = 'Try again') {
    doc.delete().then(() => {
      this.shared.openSnackBar({ msg: snackBarMessage });
    }).catch(error => {
      const undoSnackBarRef = this.shared.openSnackBar({
        msg: `${undoSnackBarMessage} ${error.message}`,
        action: undoSnackBarAction
      });
      undoSnackBarRef.onAction().subscribe(() => {
        this.deleteDoc(doc, snackBarMessage, undoSnackBarMessage, undoSnackBarAction);
      });
    });
  }

}
