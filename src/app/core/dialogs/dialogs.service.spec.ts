import { TestBed } from '@angular/core/testing';

import { DialogsModule } from './dialogs.module';
import { DialogsService } from './dialogs.service';

describe('DialogsService', () => {
  let service: DialogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogsModule]
    }).compileComponents();
    service = TestBed.inject(DialogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
