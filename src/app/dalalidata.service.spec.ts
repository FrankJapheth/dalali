import { TestBed } from '@angular/core/testing';

import { DalalidataService } from './dalalidata.service';

describe('DalalidataService', () => {
  let service: DalalidataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DalalidataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
