import { TestBed } from '@angular/core/testing';

import { DatabaseModelService } from './database-model.service';

describe('DatabaseModelService', () => {
  let service: DatabaseModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
