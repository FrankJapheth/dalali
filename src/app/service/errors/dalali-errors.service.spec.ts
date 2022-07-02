import { TestBed } from '@angular/core/testing';

import { DalaliErrorsService } from './dalali-errors.service';

describe('DalaliErrorsService', () => {
  let service: DalaliErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DalaliErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
