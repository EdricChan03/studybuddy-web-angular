import { TestBed, async, inject } from '@angular/core/testing';

import { DevelopmentGuard } from './development.guard';

describe('DevelopmentGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DevelopmentGuard]
    });
  });

  it('should ...', inject([DevelopmentGuard], (guard: DevelopmentGuard) => {
    expect(guard).toBeTruthy();
  }));
});
