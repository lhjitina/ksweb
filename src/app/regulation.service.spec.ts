import { TestBed } from '@angular/core/testing';

import { RegulationService } from './regulation.service';

describe('RegulationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegulationService = TestBed.get(RegulationService);
    expect(service).toBeTruthy();
  });
});
