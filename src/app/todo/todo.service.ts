import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable, Inject } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { TodoItem } from '../interfaces';

// Data Table imports.
import { MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';

@Injectable()
export class TodoService {
	public currentUser: string;
	private todos$: any;
	constructor(public fs: AngularFirestore, @Inject(FirebaseApp) fb, private afAuth: AngularFireAuth) {
		afAuth.auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(user);
				this.currentUser = user.uid;
				console.log(this.currentUser);
				this.todos$ = fs.collection(`users/${this.currentUser}/todos`).snapshotChanges();
			} else {
			}
		});
	}
}

@Injectable()
export class TodoDatabase {
	public dataChange: BehaviorSubject<TodoItem[]> = new BehaviorSubject<TodoItem[]>([]);
	private todoCollection: AngularFirestoreCollection<TodoItem>;
	get data(): TodoItem[] {
		return this.dataChange.value;
	}
	public getTodos(): Observable<TodoItem[]> {
		// TODO: Remove this logging line
		console.log('Getting todos...');
		return this.todoCollection.snapshotChanges().map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as TodoItem;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
		});
	}
	constructor(private todoService: TodoService) {
		this.todoCollection = todoService.fs.collection(`users/${todoService.currentUser}/todos`);
		this.getTodos().subscribe(data => this.dataChange.next(data));
	}
}

@Injectable()
export class TodoDataSource extends DataSource<TodoItem> {
	constructor(
		private todoDatabase: TodoDatabase,
		private paginator: MatPaginator
	) {
		super();
	}
	connect(): Observable<TodoItem[]> {
		const displayDataChanges = [
			this.todoDatabase.dataChange,
			this.paginator.page
		];

		return Observable
			.merge(...displayDataChanges)
			.map(() => {
				const dataSlice = this.todoDatabase.data.slice();
				const startIndex = this.paginator.pageIndex * this.paginator.pageSize;

				return dataSlice.splice(startIndex, this.paginator.pageSize);
			});
	}
	disconnect() { }
}
