import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppdownloadsComponent } from './appdownloads.component';

describe('AppdownloadsComponent', () => {
  let component: AppdownloadsComponent;
  let fixture: ComponentFixture<AppdownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppdownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppdownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
