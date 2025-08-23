import { TestBed } from '@angular/core/testing';

import { GraphListBridgeService } from './graph-list-bridge.service';

describe('GraphListBridgeService', () => {
  let service: GraphListBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphListBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
