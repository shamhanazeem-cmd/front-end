import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalhistoryComponent } from './medicalhistory.component';

describe('MedicalhistoryComponent', () => {
  let component: MedicalhistoryComponent;
  let fixture: ComponentFixture<MedicalhistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalhistoryComponent]
    });
    fixture = TestBed.createComponent(MedicalhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
