import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrescriptionService } from '../services/api/prescription/prescription.service';
import { DoctorService } from '../services/api/doctor/doctor.service';
import { PatientService } from '../services/api/patient/patient.service';
import { AppointmentService } from '../services/api/appointment/appointment.service';
import { StatusService } from '../services/api/status/status.service';


@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent implements OnInit {

  prescriptionForm!: FormGroup;
  prescriptions: any[] = [];
  isEdit: boolean = false;
  editingPrescriptionId: number | null = null;

  isLoadingPrescription: boolean = false;

  allDoctors: any[] = [];
  allPatients: any[] = [];
  allAppointments: any[] = [];
  allStatuses: any[] = [];

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private prescriptionService: PrescriptionService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private statusService: StatusService
  ) { }
  ngOnInit(): void {
    this.initFormGroup();
    this.loadDoctors();
    this.loadPrescriptions();
    this.loadPatient();
    this.loadAppointment();
    this.loadStatuses();
  }


  initFormGroup() {
    this.prescriptionForm = this.formBuilder.group({
      id: [0],
      prescriptionDate: ['', Validators.required],
      notes: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      modifyBy: [''],
      modifyDate: [''],

      doctor: ['', Validators.required],
      patient: ['', Validators.required],
      appointment: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  get f() {
    return this.prescriptionForm.controls;
  }

  
  loadStatuses() {
    this.statusService.GetAllStatus().subscribe({
      next: (response) => {
        console.log('Statuses:', response);
        this.allStatuses = response.data?.dataList || response.data || response;
      },
      error: (error) => {
        console.error('Error loading statuses:', error);
        this.allStatuses = [];
      }
    });
  }

  
  loadDoctors() {
    this.doctorService.GetAllDoctor().subscribe({
      next: (response) => {
        console.log('Doctors:', response);
        this.allDoctors = response.data?.dataList || response.data || response;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.allDoctors = [];
      }
    });
  }

  loadPatient() {
    this.patientService.GetAllPatient().subscribe({
      next: (response) => {
        console.log('Patient:', response);
        this.allPatients = response.data?.dataList || response.data || response;
      },
      error: (error) => {
        console.error('Error loading Patient:', error);
        this.allPatients = [];
      }
    });
  }

  
  loadAppointment() {
    this.appointmentService.GetAllAppointment().subscribe({
      next: (response) => {
        console.log('appointment:', response);
        this.allAppointments = response.data?.dataList || response.data || response;
      },
      error: (error) => {
        console.error('Error loading appointment:', error);
        this.allAppointments = [];
      }
    });
  }

  // Load prescriptions with pagination
  loadPrescriptions(page: number = this.currentPage, size: number = this.pageSize) {
    this.isLoadingPrescription = true;
    this.prescriptionService.getAllPrescription(page, size).subscribe({
      next: (response) => {
        this.prescriptions = response.data.dataList;

        this.currentPage = response.data.pageNumber;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.hasNext = response.data.hasNext;
        this.hasPrevious = response.data.hasPrevious;
        this.isLoadingPrescription = false;
      },
      error: () => this.isLoadingPrescription = false
    });
  }

  
  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadPrescriptions(page, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadPrescriptions(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadPrescriptions(this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0;
    this.loadPrescriptions(this.currentPage, this.pageSize);
  }

   // Save or update
  savePrescription() {
    if (this.prescriptionForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    const formData = this.prescriptionForm.value;

    if (this.isEdit && this.editingPrescriptionId !== null) {

      this.prescriptionService
        .createPrescription(this.editingPrescriptionId, formData)
        .subscribe({
          next: () => {
            this.loadPrescriptions();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    }else {
      this.prescriptionService
        .createPrescription(formData, 'Add')
        .subscribe({
          next: () => {
            this.loadPrescriptions();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    }
  }

  // Load item into form for update
  getPrescriptionById(id: number) {
    this.prescriptionService.GetPrescriptionById(id).subscribe({
      next: (res) => {
        this.prescriptionForm.patchValue({
          id: res.data.id,
          prescriptionDate: res.data.prescriptionDate,
          notes: res.data.notes,
          createdBy: res.data.createdBy,
          createdDate: res.data.createdDate,
          modifyBy: res.data.modifyBy,
          modifyDate: res.data.modifyDate,

          doctor: res.data.doctor?.id,
          patient: res.data.patient?.id,
          appointment: res.data.appointment?.id,
          status: res.data.status?.id
        });

        this.isEdit = true;
        this.editingPrescriptionId = res.data.id;
      },
      error: (err) => console.error('Error loading prescription:', err)
    });
  }

  
  deleteById(id: number) {
    if (confirm('Are you sure you want to delete this prescription?')) {
      this.prescriptionService.DeletePrescriptionById(id).subscribe({
        next: () => this.loadPrescriptions(this.currentPage, this.pageSize),
        error: (err) => console.error(err)
      });
    }
  }

  resetForm() {
    this.prescriptionForm.reset({
      id: 0,
      prescriptionDate: '',
      notes: '',
      createdBy: '',
      createdDate: '',
      modifyBy: '',
      modifyDate: '',
      doctor: '',
      patient: '',
      appointment: '',
      status: ''
    });

    this.isEdit = false;
    this.editingPrescriptionId = null;
  }

  private markFormGroupTouched() {
    Object.keys(this.prescriptionForm.controls).forEach(key => {
      const control = this.prescriptionForm.get(key);
      control?.markAsTouched();
    });
  }





}
