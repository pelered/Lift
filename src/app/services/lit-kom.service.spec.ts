import { TestBed } from '@angular/core/testing';

import { LitKomService } from './lit-kom.service';

describe('LitKomService', () => {
  let service: LitKomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LitKomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
