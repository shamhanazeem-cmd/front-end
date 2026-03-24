import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../services/api/appointment/appointment.service';
import { DoctorService } from '../services/api/doctor/doctor.service';
import { PatientService } from '../services/api/patient/patient.service';
import { ScheduleService } from '../services/api/schedule/schedule.service';
import { StatusService } from '../services/api/status/status.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})

export class AppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  appointments: any[] = [];
  isEdit: boolean = false;
  editingAppointmentId: number | null = null;
  isLoadingAppointments: boolean = false;

  allDoctors: any[] = [];
  allPatients: any[] = [];
  allSchedules: any[] = [];
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
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private scheduleService: ScheduleService,
    private statusService: StatusService
  ) { }


  ngOnInit(): void {
    this.initFormGroup();
    this.loadAppointments();
    this.loadDoctors();
    this.loadPatients();
    this.loadSchedule();
    this.loadStatus()
  }

  initFormGroup() {
    this.appointmentForm = this.formBuilder.group({
      id: [0],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      modifyBy: [''],
      modifyDate: [''],

      doctor: ['', Validators.required],
      patient: ['', Validators.required],
      schedule: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  // Form getter
  get f() {
    return this.appointmentForm.controls;
  }

   // Load doctor
  loadDoctors() {
    this.doctorService.GetAllDoctor().subscribe({
      next: (response) => {
        console.log("Data " , response);
        
        this.allDoctors = response.data?.dataList || response.data || response;
      },
      error: (error) => {
        console.error('Error loading Doctors:', error);
        this.allDoctors = [];
      }
    });
  }

   // Load patient
  loadPatients() {
    this.patientService.GetAllPatient().subscribe({
      next: (response) => {
        console.log("Data " , response);
        
        this.allPatients = response.data?.dataList || response.data || response;
      },
      error: (error) => {
        console.error('Error loading Patients:', error);
        this.allPatients = [];
      }
    });
  }

   // Load schedule
  loadSchedule() {
    this.scheduleService.GetAllSchedule().subscribe({
      next: (response) => {
        console.log("Data " , response);
        
        this.allSchedules = response.data?.dataList || response.data || response;
      },
      error: (error) => {
        console.error('Error loading Schedule:', error);
        this.allSchedules = [];
      }
    });
  }

   // Load statuses
  loadStatus() {
    this.statusService.GetAllStatus().subscribe({
      next: (response) => {
        console.log("Data " , response);
        
        this.allStatuses = response.data?.dataList || response.data || response;
      },
      error: (error) => {
        console.error('Error loading statuses:', error);
        this.allStatuses = [];
      }
    });
  }

   // Load appointments with pagination
  loadAppointments(page: number = this.currentPage, size: number = this.pageSize) {
    this.isLoadingAppointments = true;

    this.appointmentService.getAllAppointments(page, size).subscribe({
      next: (response) => {
        this.appointments = response.data.dataList;

        this.currentPage = response.data.pageNumber;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.hasNext = response.data.hasNext;
        this.hasPrevious = response.data.hasPrevious;

        this.isLoadingAppointments = false;
      },
      error: (error) => {
        console.error("Error loading appointments:", error);
        this.isLoadingAppointments = false;
      }
    });
  }

  
  // Pagination controls
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadAppointments(page, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadAppointments(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadAppointments(this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0;
    this.loadAppointments(this.currentPage, this.pageSize);
  }

  // Save or update
  saveAppointment() {
    if (this.appointmentForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    const formData = this.appointmentForm.value;

    if (this.isEdit && this.editingAppointmentId !== null) {

      this.appointmentService
        .createAppointment(this.editingAppointmentId, formData)
        .subscribe({
          next: () => {
            this.loadAppointments();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    }else {
      this.appointmentService
        .createAppointment(formData, 'Add')
        .subscribe({
          next: () => {
            this.loadAppointments();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    }
  }
   getAppointmentById(id: string) {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment) => {
        this.appointmentForm.patchValue({
          id: appointment.data.id,
          appointmentDate: appointment.data.appointmentDate,
          appointmentTime: appointment.data.appointmentTime,
          createdBy: appointment.data.createdBy,
          createdDate: appointment.data.createdDate,
          modifyBy: appointment.data.modifyBy,
          modifyDate: appointment.data.modifyDate,

          doctor: appointment.data.doctor?.id,
          patient: appointment.data.patient?.id,
          schedule: appointment.data.schedule?.id,
          status: appointment.data.status?.id
        });

        this.isEdit = true;
        this.editingAppointmentId = appointment.id;
      },
      error: (error) => {
        console.error("Error loading appointment:", error);
      }
    });
  }

   deleteById(id: string) {
    if (confirm("Are you sure you want to delete this appointment?")) {
      this.appointmentService.deleteAppointmentById(id).subscribe({
        next: (response) => {
          console.log("Appointment deleted:", response);
          this.loadAppointments(this.currentPage, this.pageSize);
        },
        error: (error) => {
          console.error("Error deleting appointment:", error);
        }
      });
    }
  }

  resetForm() {
    this.appointmentForm.reset({
      id: 0,
      appointmentDate: '',
      appointmentTime: '',
      createdBy: '',
      createdDate: '',
      modifyBy: '',
      modifyDate: '',
      doctor: '',
      patient: '',
      schedule: '',
      status: ''
    });

    this.isEdit = false;
    this.editingAppointmentId = null;
  }

  private markFormGroupTouched() {
    Object.keys(this.appointmentForm.controls).forEach((key) => {
      const control = this.appointmentForm.get(key);
      control?.markAsTouched();
    });
  }
}







