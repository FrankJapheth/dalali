import { TestBed } from '@angular/core/testing';

import { DalaliSessionStorageService } from './dalali-session-storage.service';

describe('DalaliSessionStorageService', () => {
  let service: DalaliSessionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DalaliSessionStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
