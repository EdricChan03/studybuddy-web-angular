import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ApiService } from '../../api.service';
import { AuthService } from '../../auth.service';
import { Chat } from '../../interfaces';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-chat-explore',
  templateUrl: './chat-explore.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatExploreComponent {
  // chatsSearch$ = new Subject<string>();
  // chatsSearchResults$: Observable<Chat[]>;
  lastMonthDate = new Date();
  publicChats$: Observable<Chat[]>;
  recentChats$: Observable<Chat[]>;
  publicChatCollection: AngularFirestoreCollection<Chat>;
  constructor(
    private afFs: AngularFirestore,
    private api: ApiService,
    private auth: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public shared: SharedService
  ) {
    this.lastMonthDate.setMonth(this.lastMonthDate.getMonth() - 1);
    shared.title = 'Explore chats';
    auth.getAuthState().subscribe(user => {
      if (user) {
        this.publicChatCollection = afFs.collection<Chat>('chats', query => query.where('visibility', '==', 'public'));
        this.recentChats$ = afFs.collection<Chat>('chats',
          query => query.where('visibility', '==', 'public')
                        .where('createdAt', '>', firestore.Timestamp.fromDate(this.lastMonthDate))
        ).valueChanges({ idField: 'id' });
        this.publicChats$ = this.publicChatCollection.valueChanges({ idField: 'id' });
      }
    });
  }

  getUserData(userDoc: DocumentReference): Observable<firebase.User> {
    return this.afFs.doc(`users/${userDoc.id}`).get().pipe(
      take(1),
      map(snapshot => snapshot.data() as firebase.User)
    );
    // return this.api.getUserById(ownerDoc.id);
  }

  getUserDisplayName(userDoc: DocumentReference): Observable<string> {
    return this.getUserData(userDoc).pipe(map(user => user.displayName));
  }
}
