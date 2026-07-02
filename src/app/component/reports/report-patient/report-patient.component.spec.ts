import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPatientComponent } from './report-patient.component';

describe('ReportPatientComponent', () => {
  let component: ReportPatientComponent;
  let fixture: ComponentFixture<ReportPatientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportPatientComponent]
    });
    fixture = TestBed.createComponent(ReportPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
