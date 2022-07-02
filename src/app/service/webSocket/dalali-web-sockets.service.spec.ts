import { TestBed } from '@angular/core/testing';

import { DalaliWebSocketsService } from './dalali-web-sockets.service';

describe('DalaliWebSocketsService', () => {
  let service: DalaliWebSocketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DalaliWebSocketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
