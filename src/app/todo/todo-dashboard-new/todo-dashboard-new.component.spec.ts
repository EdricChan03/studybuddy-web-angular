
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDashboardNewComponent } from './todo-dashboard-new.component';

describe('TodoDashboardNewComponent', () => {
	let component: TodoDashboardNewComponent;
	let fixture: ComponentFixture<TodoDashboardNewComponent>;

	beforeEach(fakeAsync(() => {
		TestBed.configureTestingModule({
			declarations: [TodoDashboardNewComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(TodoDashboardNewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should compile', () => {
		expect(component).toBeTruthy();
	});
});
