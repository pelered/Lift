import { TestBed } from '@angular/core/testing';

import { LiftService } from './lift.service';

describe('LiftService', () => {
  let service: LiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
