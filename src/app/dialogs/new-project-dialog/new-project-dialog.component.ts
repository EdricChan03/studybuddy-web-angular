import { Component } from '@angular/core';
import { TodoProject } from '../../interfaces';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs';
import { SharedService } from '../../shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'new-project-dialog',
	templateUrl: './new-project-dialog.component.html'
})
export class NewProjectDialogComponent {
	colorError: string = '';
	options: FormGroup;
	currentUser: string;
	projectsCollection: AngularFirestoreCollection<TodoProject>;
	constructor(
		private authService: AuthService,
		private fs: AngularFirestore,
		private shared: SharedService,
		private fb: FormBuilder
	) {
		this.options = fb.group({
			'name': ['', [Validators.required, Validators.minLength(3)]],
			'color': ['#000000', [Validators.required, Validators.pattern(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)]]
		})
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
		this.projectsCollection.add({ name: this.options.get('name').value, color: this.options.get('color').value }).then(result => {
			// tslint:disable-next-line:max-line-length
			this.shared.openSnackBar({ msg: 'Project was added', additionalOpts: { duration: 5000, panelClass: 'mat-elevation-z3', horizontalPosition: 'start' } });
			console.log(`Successfully written data with result: ${result}`);
		}, error => {
			// tslint:disable-next-line:max-line-length
			this.shared.openSnackBar({ msg: `An error occured: ${error.message}`, additionalOpts: { duration: 6000, horizontalPosition: 'start' }, hasElevation: true });
			console.error(`An error occured: ${error.message}`);
		});
	}
}