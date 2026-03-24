import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../services/api/doctor/doctor.service';
import { StatusService } from '../services/api/status/status.service';
import { SpecializationService } from '../services/api/specialization/specialization.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})

export class DoctorComponent implements OnInit {
  doctorForm!: FormGroup;
  doctors: any[] = [];
  isEdit: boolean = false;
  editingDoctorId: number | null = null;
  isLoadingDoctors: boolean = false;

  allStatuses: any[] = [];
  allSpecializations: any[] = [];

  // Pagination properties
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private doctorService: DoctorService,
    private statusService: StatusService,
    private specializationService: SpecializationService
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.loadDoctors();
    this.loadStatus();
    this.loadSpecializations();
  }

  initFormGroup() {
    this.doctorForm = this.formBuilder.group({
      id: [0],
      doctorName: ['', Validators.required],
      contactDetails: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      roomNo: ['', Validators.required],

      createdBy: [''],
      createdDate: [''],
      modifyBy: [''],
      modifyDate: [''],

      status: ['', Validators.required],
      specializations: ['', Validators.required]
    });
  }

  get f() {
    return this.doctorForm.controls;
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

  // Load specializations
  loadSpecializations() {
    console.log("Calling loadSpecializations()...");

    this.specializationService.getAllSpecializations().subscribe({
      next: (response) => {
         console.log("Data " , response);

        this.allSpecializations = response.data?.dataList || response.data || response;
      },
      error: (error) => {
        console.error('Error loading specializations:', error);
        this.allSpecializations = [];
      }
    });
  }

   loadDoctors(page: number = this.currentPage, size: number = this.pageSize) {
    this.isLoadingDoctors = true;
    this.doctorService.getAllDoctors(page, size).subscribe({
      next: (response) => {
        this.doctors = response.data.dataList;

        this.currentPage = response.data.pageNumber;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.hasNext = response.data.hasNext;
        this.hasPrevious = response.data.hasPrevious;

        this.isLoadingDoctors = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.isLoadingDoctors = false;
      }
    });
  }

  // Pagination controls
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadDoctors(page, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadDoctors(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadDoctors(this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0;
    this.loadDoctors(this.currentPage, this.pageSize);
  }


   // Save or update
  saveDoctor() {
    if (this.doctorForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    const formData = this.doctorForm.value;

   if (this.isEdit && this.editingDoctorId !== null) {

      this.doctorService
        .createDoctor(this.editingDoctorId, formData)
        .subscribe({
          next: () => {
            this.loadDoctors();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    }else {
      this.doctorService
        .createDoctor(formData, 'Add')
        .subscribe({
          next: () => {
            this.loadDoctors();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    }
  }

   getDoctorById(id: number) {
    this.doctorService.getDoctorById(id).subscribe({
      next: (response) => {
        const doctor = response.data;

        this.doctorForm.patchValue({
          id: doctor.id,
          doctorName: doctor.doctorName,
          contactDetails: doctor.contactDetails,
          mail: doctor.mail,
          roomNo: doctor.roomNo,

          createdBy: doctor.createdBy,
          createdDate: doctor.createdDate,
          modifyBy: doctor.modifyBy,
          modifyDate: doctor.modifyDate,

          status: doctor.status?.id || doctor.status,
          specializations: doctor.specializations?.id || doctor.specializations
        });

        this.isEdit = true;
        this.editingDoctorId = doctor.id;
      },
      error: (error) => console.error('Error loading doctor by ID:', error)
    });
  }

   deleteById(id: number) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctorById(id).subscribe({
        next: (response) => {
          console.log('Doctor deleted:', response);
          this.loadDoctors(this.currentPage, this.pageSize);
        },
        error: (error) => console.error('Error deleting doctor:', error)
      });
    }
  }

  resetForm() {
    this.doctorForm.reset({
      id: 0,
      doctorName: '',
      contactDetails: '',
      mail: '',
      roomNo: '',
      createdBy: '',
      createdDate: '',
      modifyBy: '',
      modifyDate: '',
      status: '',
      specializations: ''
    });
    this.isEdit = false;
    this.editingDoctorId = null;
  }

  private markFormGroupTouched() {
    Object.keys(this.doctorForm.controls).forEach(key => {
      const control = this.doctorForm.get(key);
      control?.markAsTouched();
    });
  }

}
