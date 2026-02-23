import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { collection, CollectionReference, doc, DocumentReference, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentData, FirestoreDataConverter } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  readonly userDoc$: Observable<DocumentReference | null>;
  constructor(
    auth: Auth,
    firestore: Firestore
  ) {
    this.userDoc$ = user(auth)
      .pipe(
        map((user) => {
          if (user === null) return null;
          return doc(firestore, `users/${user.uid}`);
        })
      )
  }

  getUserCollection<AppModelType, DbModelType extends DocumentData = DocumentData>(
    collectionName: string,
    converter: FirestoreDataConverter<AppModelType, DbModelType>
  ): Observable<CollectionReference<AppModelType, DbModelType> | null> {
    return this.userDoc$.pipe(
      map((userDoc) => {
        if (userDoc === null) return null;
        return collection(userDoc, collectionName).withConverter(converter);
      })
    )
  }
}
