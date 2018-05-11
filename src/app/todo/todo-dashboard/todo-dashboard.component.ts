
import { map, filter } from 'rxjs/operators';
import { SharedService } from '../../shared.service';
import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ToolbarService } from '../../toolbar.service';
import { Observable } from 'rxjs';
import { TodoProject } from '../../interfaces';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { animations } from '../../animations';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { NewProjectDialogComponent } from '../../dialogs';
import { transition, style, animate, trigger, keyframes } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-todo-dashboard',
	templateUrl: './todo-dashboard.component.html',
	styleUrls: ['./todo-dashboard.component.scss'],
	animations: [
		trigger('todoProjectUpdateAnim', [
			transition(':enter', [
				animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', keyframes([
					style({ 'background-color': '*', offset: 0 }),
					style({ 'background-color': '#fff3e0', offset: 0.25 }),
					style({ 'background-color': '#fff3e0', offset: 0.75 }),
					style({ 'background-color': '*', offset: 1 })
				])
				)]
			)])
	]
})
export class TodoDashboardComponent {
	currentUser: string;
	projects$: Observable<TodoProject[]>;
	projectsCollection: AngularFirestoreCollection<TodoProject>;
	constructor(
		private authService: AuthService,
		private toolbarService: ToolbarService,
		private shared: SharedService,
		private fs: AngularFirestore,
		private dom: DomSanitizer,
		private dialog: MatDialog,
		private route: ActivatedRoute,
		private router: Router
	) {
		route.queryParams.pipe(
			filter(params => params.new)).
			subscribe(params => {
				if (params.new) {
					router.navigate(['/todo/dashboard-new'])
				};
			})
		shared.title = 'Todo Dashboard';
		this.authService.getAuthState().subscribe((user) => {
			if (user) {
				console.log(user);
				this.currentUser = user.uid;
				this.projectsCollection = this.fs.collection(`users/${this.currentUser}/todoProjects`);
				this.projects$ = this.projectsCollection.snapshotChanges().pipe(map(result => {
					return result.map(a => {
						const data = a.payload.doc.data() as TodoProject;
						data.id = a.payload.doc.id;
						// Check if color property exists
						data.color = a.payload.doc.data().color ? a.payload.doc.data().color : shared.getRandomColor();
						return data;
					});
				}));
				this.projects$.subscribe(() => {
					this.toolbarService.setProgress(false);
				})
			} else {
				console.warn('Current user doesn\'t exist yet!');
			}
		});
	}
	get isMobile(): boolean {
		return this.shared.isMobile;
	}
	getRandomColor(): string {
		return this.shared.getRandomColor();
	}
	addNewProject() {
		this.dialog.open(NewProjectDialogComponent);
	}
	deleteProject(id: string) {
		this.projectsCollection.doc(id).delete().then(() => {
			// tslint:disable-next-line:max-line-length
			this.shared.openSnackBar({ msg: 'Project was removed', additionalOpts: { duration: 3000, horizontalPosition: 'start', panelClass: 'mat-elevation-z3' } });
		})
	}
	removeProject(id: string, bypassDialog?: boolean, event?: KeyboardEvent) {
		if (event) {
			event.stopImmediatePropagation();
			event.preventDefault();
			// Check if shift key is pressed
			if (event.shiftKey || bypassDialog) {
				this.deleteProject(id);
			} else {
				// Show confirmation dialog
				this.deleteConfirmDialog(id, true);
			}
		} else {
			this.deleteConfirmDialog(id, true);
		}
	}
	deleteConfirmDialog(id: string, showHint?: boolean) {
		// tslint:disable-next-line:max-line-length
		let dialogText = '<p>Are you sure you want to delete the project? Once deleted, it will be lost forever and cannot be retrieved again.</p>';
		if (showHint) {
			dialogText += '<p><small>TIP: To bypass this dialog, hold the shift key when clicking the delete button.</small></p>';
		}
		// tslint:disable-next-line:max-line-length
		let dialogRef = this.shared.openConfirmDialog({ msg: this.dom.bypassSecurityTrustHtml(dialogText), title: 'Delete project?', isHtml: true, ok: 'Delete', okColor: 'warn' });
		dialogRef.afterClosed().subscribe(res => {
			if (res === 'ok') {
				this.deleteProject(id);
			} else {
				// tslint:disable-next-line:max-line-length
				this.shared.openSnackBar({ msg: 'Project was not deleted', action: 'Undo', additionalOpts: { duration: 6000, horizontalPosition: 'start', panelClass: 'mat-elevation-z3' } }).onAction().subscribe(() => {
					this.removeProject(id, true);
				});
			}
		});
	}
	ngOnInit() {
		this.toolbarService.setProgress(true, true);
	}
}
