import { TestBed } from '@angular/core/testing';

import { RegionycomunaService } from './regionycomuna.service';

describe('RegionycomunaService', () => {
  let service: RegionycomunaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionycomunaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
