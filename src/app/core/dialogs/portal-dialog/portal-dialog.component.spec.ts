import { ComponentFixture, TestBed, TestModuleMetadata, TestBedStatic } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { PortalDialogComponent } from './portal-dialog.component';
import { PortalDialogOpts } from '../models';

describe('PortalDialogComponent', () => {
  let component: PortalDialogComponent;
  let componentEl: HTMLElement;
  let fixture: ComponentFixture<PortalDialogComponent>;

  function configureTestingModule(moduleDef?: Partial<TestModuleMetadata>, resetTestingModule: boolean = false): TestBedStatic {
    if (resetTestingModule) {
      TestBed.resetTestingModule();
    }

    const DEFAULT_MODULE_DEF: TestModuleMetadata = {
      declarations: [PortalDialogComponent],
      imports: [
        MatButtonModule,
        MatDialogModule
      ]
    };

    return TestBed.configureTestingModule({
      ...DEFAULT_MODULE_DEF,
      ...moduleDef
    });
  }
  beforeEach(() => {
    configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortalDialogComponent);
    component = fixture.componentInstance;
    componentEl = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('component buttons', () => {

    describe('get hideNegativeBtn', () => {
      // TODO
    });
  });

  xdescribe('component template', () => {
    describe('dialog title', () => {
      it('should have a title if PortalDialogOpts#title was specified', () => {
        const opts: Partial<PortalDialogOpts<any>> = {
          title: 'Hello title!'
        };

        configureTestingModule({
          providers: [
            { provide: MAT_DIALOG_DATA, useValue: opts }
          ]
        }, /* resetTestingModule = */ true).compileComponents();
        const localFixture = TestBed.createComponent(PortalDialogComponent);
        const localComponentEl: HTMLElement = localFixture.nativeElement;
        localFixture.detectChanges();

        const newH2Els = localComponentEl.querySelectorAll('h2');
        expect(newH2Els.length).toEqual(1, 'Expected the template to have a title');

        const dialogTitleEl = localComponentEl.querySelector('h2');
        expect(dialogTitleEl.textContent).toEqual(opts.title);
      });
    });
    describe('dialog message', () => {
      it('should have a message if PortalDialogOpts#msg was specified', () => {
        const opts: Partial<PortalDialogOpts<any>> = {
          msg: 'Hello message!'
        };

        configureTestingModule({
          providers: [
            { provide: MAT_DIALOG_DATA, useValue: opts }
          ]
        }, /* resetTestingModule = */ true).compileComponents();
        const localFixture = TestBed.createComponent(PortalDialogComponent);
        const localComponentEl: HTMLElement = localFixture.nativeElement;
        localFixture.detectChanges();

        const newBodyEls = localComponentEl.querySelectorAll('p');
        expect(newBodyEls.length).toEqual(1, 'Expected the template to have a message');

        const dialogMsgEl = localComponentEl.querySelector('p');
        expect(dialogMsgEl.textContent).toEqual(opts.msg as string);
      });
    });
  });
});
