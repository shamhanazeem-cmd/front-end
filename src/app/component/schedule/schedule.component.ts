import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from '../services/api/schedule/schedule.service';
import { DoctorService } from '../services/api/doctor/doctor.service';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent  implements OnInit {
  scheduleForm!: FormGroup;
  schedules: any[] = [];
  isEdit: boolean = false;
  editingScheduleId: string | null = null;
  isLoadingSchedules: boolean = false;

  allDoctors: any[] = [];

 // Pagination properties
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private scheduleService: ScheduleService,
    private doctorService: DoctorService  

  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.loadSchedules();
    this.loadDoctors();   

  }

  initFormGroup() {
    this.scheduleForm = this.formBuilder.group({
      id: [0],
      dayOfWeek: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      slotDuration: ['', Validators.required],
      maxPatients: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      modifyBy: [''],
      modifyDate: [''],
      doctor: ['', Validators.required]
    });
  }

  
  get f() {
    return this.scheduleForm.controls;
  }

  // Load doctors 
  loadDoctors() {
    this.doctorService.getAllDoctors().subscribe({
       next: (response) => {
      console.log("Data " , response);

        this.allDoctors = response.data?.dataList || response.data || response;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.allDoctors = [];
      }
    });
  }


    // Load schedules
  loadSchedules(page: number = this.currentPage, size: number = this.pageSize) {
    this.isLoadingSchedules = true;

    this.scheduleService.getAllSchedules(page, size).subscribe({
      next: (response) => {
        this.schedules = response.data.dataList;

        this.currentPage = response.data.pageNumber;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.hasNext = response.data.hasNext;
        this.hasPrevious = response.data.hasPrevious;

        this.isLoadingSchedules = false;
      },
      error: (error) => {
        console.error('Error loading schedules:', error);
        this.isLoadingSchedules = false;
      }
    });
  }

  
  // Pagination controls
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadSchedules(page, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadSchedules(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadSchedules(this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0;
    this.loadSchedules(this.currentPage, this.pageSize);
  }

  // Save or update
  saveSchedule() {
    if (this.scheduleForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.scheduleForm.value;

    if (this.editingScheduleId) {
      this.scheduleService.createSchedule(this.editingScheduleId, formData).subscribe({
        next: (response) => {
          console.log('Schedule updated:', response);
          this.loadSchedules();
          this.resetForm();
        },
        error: (error) => console.error('Error updating schedule:', error)
      });}
  }

   // Get schedule by ID
  getScheduleById(id: number) {
    this.scheduleService.getScheduleById(id).subscribe({
      next: (response) => {
        const schedule = response.data;

        this.scheduleForm.patchValue({
          id: schedule.id,
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          slotDuration: schedule.slotDuration,
          maxPatients: schedule.maxPatients,

          createdBy: schedule.createdBy,
          createdDate: schedule.createdDate,
          modifyBy: schedule.modifyBy,
          modifyDate: schedule.modifyDate,

          doctor: schedule.doctor?.id || schedule.doctor
        });

        this.isEdit = true;
        this.editingScheduleId = schedule.id;
      },
      error: (error) => console.error('Error loading schedule by ID:', error)
    });
  }

   deleteById(id: number) {
    if (confirm('Are you sure you want to delete this schedule?')) {
      this.scheduleService.deleteScheduleById(id).subscribe({
        next: (response) => {
          console.log('Schedule deleted:', response);
          this.loadSchedules(this.currentPage, this.pageSize);
        },
        error: (error) => console.error('Error deleting schedule:', error)
      });
    }
  }

  resetForm() {
    this.scheduleForm.reset({
      id: 0,
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      slotDuration: '',
      maxPatients: '',
      createdBy: '',
      createdDate: '',
      modifyBy: '',
      modifyDate: '',
      doctor: ''
    });

    this.isEdit = false;
    this.editingScheduleId = null;
  }

  private markFormGroupTouched() {
    Object.keys(this.scheduleForm.controls).forEach(key => {
      const control = this.scheduleForm.get(key);
      control?.markAsTouched();
    });
  }
  




}