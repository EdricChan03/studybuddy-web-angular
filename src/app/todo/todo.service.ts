import { AngularFireAuth } from 'angularfire2/auth';
import { Todo, Shared } from './../shared';
import { Injectable, Inject } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';

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
	private todos$: Observable<Todo[]>;
	constructor(public af: AngularFireDatabase, @Inject(FirebaseApp) fb, private afAuth: AngularFireAuth) {
		afAuth.auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(user);
				this.currentUser = user.uid;
				console.log(this.currentUser);
				this.todos$ = af.list(`users/${this.currentUser}/todo`).valueChanges();
			} else {
			}
		})
	}
}

@Injectable()
export class TodoDatabase {
	public dataChange: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
	private database = this.todoService.af.list(`users/${this.todoService.currentUser}/todo`);
	get data(): Todo[] {
		return this.dataChange.value;
	}
	public getTodos(): Observable<Todo[]> {
		console.log("Getting todos...");
		return this.database.valueChanges();
	}
	constructor(private todoService: TodoService, private shared: Shared) {
		this.getTodos().subscribe(data => this.dataChange.next(data));
	}
}

@Injectable()
export class TodoDataSource extends DataSource<Todo> {
	constructor(
		private todoDatabase: TodoDatabase,
		private paginator: MatPaginator
	) {
		super();
	}
	connect(): Observable<Todo[]> {
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
			})
	}
	disconnect() { }
}