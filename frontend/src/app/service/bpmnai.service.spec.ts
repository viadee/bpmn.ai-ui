import { TestBed } from '@angular/core/testing';

import { BpmnaiService } from './bpmnai.service';

describe('BpmnaiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BpmnaiService = TestBed.get(BpmnaiService);
    expect(service).toBeTruthy();
  });
});
