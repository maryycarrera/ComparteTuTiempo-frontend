import { TestBed } from '@angular/core/testing';

import { SolidarityFundService } from './solidarity-fund.service';

describe('SolidarityFundService', () => {
  let service: SolidarityFundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolidarityFundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
