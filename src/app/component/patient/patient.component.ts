import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/api/patient/patient.service';
import { MedicalHistoryService } from '../services/api/medicalhistory/medicalhistory.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  patientForm!: FormGroup;
  patients: any[] = [];
  allMedicalHistories: any[] = [];
  isEditPatient: boolean = false;
  editingPatientId: string | null = null;
  isLoadingPatients: boolean = false;
  isLoadingMedicalHistory: boolean = false;

  // Pagination properties
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private medicalHistoryService: MedicalHistoryService
    
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.loadMedicalHistories();
    this.loadPatients();
  }

  initFormGroup() {
    this.patientForm = this.formBuilder.group({
      id: [0],
      fullName: ['', Validators.required],
      nic: ['', [Validators.required,]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      contactNo: ['', [Validators.required]],
      email: ['', [Validators.required,]],
      medicalHistory: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      modifyBy: [''],
      modifyDate: ['']
    });
  }

  get f() {
    return this.patientForm.controls;
  }GetAllPatient(){

}

loadMedicalHistories() {
    this.isLoadingMedicalHistory = true;
    this.medicalHistoryService.getAllMedicalHistories().subscribe({
      next: (response) => {
        this.allMedicalHistories = response.data?.dataList || [];
        this.isLoadingMedicalHistory = false;
      },
      error: (error) => {
        console.error('Error loading medical histories:', error);
        this.isLoadingMedicalHistory = false;
      }
    });
  }

  loadPatients(page: number = this.currentPage, size: number = this.pageSize) {
    this.isLoadingPatients = true;
    this.patientService.getAllPatients(page, size).subscribe({
      next: (response) => {
        this.patients = response.data.dataList;
        this.currentPage = response.data.pageNumber;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.hasNext = response.data.hasNext;
        this.hasPrevious = response.data.hasPrevious;
        this.isLoadingPatients = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.isLoadingPatients = false;
      }
    });
  }

   goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadPatients(page, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadPatients(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadPatients(this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0;
    this.loadPatients(this.currentPage, this.pageSize);
  }
SavePatient() {
    if (this.patientForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.patientForm.value;

    if (this.isEditPatient && this.editingPatientId) {
      // Update existing patient
      this.patientService.createPatient(this.editingPatientId, formData).subscribe({
        next: (response) => {
          console.log('Patient updated:', response);
          this.loadPatients();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating patient:', error);
        }
      });
    } else {
      // Create new patient
     // this.patientService.createPatient(formData).subscribe({
       // next: (res) => {
         // console.log('Patient created:', res);
          //this.loadPatients(0, this.pageSize);
          //this.resetForm();
       // },
       // error: (err) => {
        //  console.error('Error creating patient:', err);
       // }
      //});
    }
  }
GetPatientById(id: string) {
    this.patientService.getPatientsById(id).subscribe({
      next: (patient) => {
      // Populate form with patient data for editing
        this.patientForm.patchValue({
          id: patient.data.id,
          fullName: patient.data.fullName,
          nic: patient.data.nic,
          dob: patient.data.dob,
          gender: patient.data.gender,
          address:patient.data.address,
          contactNo: patient.data.contactNo,
          email: patient.data.email,
          medicalHistory: patient.data.medicalHistory?.id,
          createdBy: patient.data.createdBy,
          createdDate: patient.data.createdDate,
          modifyBy: patient.data.modifyBy,
          modifyDate:patient.data.modifyDate
        });
        this.isEditPatient = true;
        this.editingPatientId = id;
      },
      error: (error) => {
        console.error('Error fetching patient:', error);
      }
    });
  }

   DeleteById(id: string) {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatientById(id).subscribe({
        next: (response) => {
          console.log('Patient deleted:', response);
          this.loadPatients(this.currentPage, this.pageSize);
        },
        error: (error) => {
          console.error('Error deleting patient:', error);
        }
      });
    }
  }

  resetForm() {
    this.patientForm.reset({
      id: 0,
      fullName: '',
      nic: '',
      dob: '',
      gender: '',
      address: '',
      contactNo: '',
      email: '',
      medicalHistory: '',
      createdBy: '',
      createdDate: '',
      modifyBy: '',
      modifyDate: ''
    });
    this.isEditPatient = false;
    this.editingPatientId = null;
  }

  private markFormGroupTouched() {
    Object.keys(this.patientForm.controls).forEach(key => {
      const control = this.patientForm.get(key);
      control?.markAsTouched();
    });
  }

}
