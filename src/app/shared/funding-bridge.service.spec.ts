import { TestBed } from '@angular/core/testing';

import { FundingBridgeService } from './funding-bridge.service';

describe('FundingBridgeService', () => {
  let service: FundingBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundingBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
