import { TestBed } from '@angular/core/testing';

import { BasicdataService } from './basicdata.service';

describe('BasicdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BasicdataService = TestBed.get(BasicdataService);
    expect(service).toBeTruthy();
  });
});
