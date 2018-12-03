import { TestBed } from '@angular/core/testing';

import { RegcommService } from './regcomm.service';

describe('RegcommService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegcommService = TestBed.get(RegcommService);
    expect(service).toBeTruthy();
  });
});
