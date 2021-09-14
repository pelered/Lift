import { TestBed } from '@angular/core/testing';

import { PutovanjeService } from './putovanje.service';

describe('PutovanjeService', () => {
  let service: PutovanjeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PutovanjeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
