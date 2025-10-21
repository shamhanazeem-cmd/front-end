import { TestBed } from '@angular/core/testing';

import { MedicalhistoyService } from './medicalhistoy.service';

describe('MedicalhistoyService', () => {
  let service: MedicalhistoyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalhistoyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
