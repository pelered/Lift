import { TestBed } from '@angular/core/testing';

import { ZgradaService } from './zgrada.service';

describe('ZgradaService', () => {
  let service: ZgradaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZgradaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
