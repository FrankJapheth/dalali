import { TestBed } from '@angular/core/testing';

import { DalaliCachesService } from './dalali-caches.service';

describe('DalaliCachesService', () => {
  let service: DalaliCachesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DalaliCachesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
