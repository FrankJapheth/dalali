import { TestBed } from '@angular/core/testing';

import { BackendcommunicatorService } from './backendcommunicator.service';

describe('BackendcommunicatorService', () => {
  let service: BackendcommunicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendcommunicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
