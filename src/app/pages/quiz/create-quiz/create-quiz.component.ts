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

  constructor(
    private afAuth: AngularFireAuth,
    private afFs: AngularFirestore,
    private formlyJsonSchema: FormlyJsonschema,
    private shared: SharedService
  ) {
    shared.title = 'Create quiz';
    this.quizzesCollection = afFs.collection('quizzes');
  }

  ngOnInit() {
  }

  submit() {
    this.quizzesCollection.add({
      ...this.model,
      author: this.afFs.doc(`users/${this.afAuth.auth.currentUser.uid}`).ref,
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastModified: firestore.FieldValue.serverTimestamp()
    } as any).then(doc => {
      const snackBarRef = this.shared.openSnackBarWithOpts('Successfully submitted quiz!', 'Undo');
      snackBarRef.onAction().subscribe(() => {
        this.deleteDoc(doc);
      });
    }).catch(error => {
      const snackBarRef = this.shared.openSnackBarWithOpts(`Could not submit quiz: ${error.message}`, 'Try again', 6000);
      snackBarRef.onAction().subscribe(() => { this.submit(); });
    });
  }

  // Utility method to show snackbar for deletion of document
  private deleteDoc(doc: firestore.DocumentReference, snackBarMessage?: string,
    undoSnackBarMessage?: string, undoSnackBarAction?: string) {
    snackBarMessage = snackBarMessage ? snackBarMessage : 'Successfully undone submission of quiz.';
    undoSnackBarMessage = undoSnackBarMessage ? undoSnackBarMessage : 'Could not undo submission of quiz:';
    undoSnackBarAction = undoSnackBarAction ? undoSnackBarAction : 'Try again';
    doc.delete().then(() => {
      this.shared.openSnackBarWithOpts(snackBarMessage);
    }).catch(error => {
      const undoSnackBarRef = this.shared.openSnackBarWithOpts(`${undoSnackBarMessage} ${error.message}`, undoSnackBarAction);
      undoSnackBarRef.onAction().subscribe(() => {
        this.deleteDoc(doc, snackBarMessage, undoSnackBarMessage, undoSnackBarAction);
      });
    });
  }

}
