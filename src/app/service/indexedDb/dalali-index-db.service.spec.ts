import { TestBed } from '@angular/core/testing';

import { DalaliIndexDbService } from './dalali-index-db.service';

describe('DalaliIndexDbService', () => {
  let service: DalaliIndexDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DalaliIndexDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
