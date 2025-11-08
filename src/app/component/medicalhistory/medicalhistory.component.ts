import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicalHistoryService } from '../services/api/medicalhistory/medicalhistory.service';
import { StatusService } from '../services/api/status/status.service';

@Component({
  selector: 'app-medicalhistory',
  templateUrl: './medicalhistory.component.html',
  styleUrls: ['./medicalhistory.component.scss']
})
export class MedicalHistoryComponent implements OnInit {
  medicalHistoryForm!: FormGroup;
  medicalHistories: any[] = [];
  isEdit: boolean = false;
  editingMedicalHistoryId: number | null = null;
  isLoadingMedicalHistory: boolean = false;
  allStatuses: any[] = [];

  // Pagination properties
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private medicalHistoryService: MedicalHistoryService,
    private statusService: StatusService
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.loadMedicalHistories();
    this.loadStatuses();
  }

  initFormGroup() {
    this.medicalHistoryForm = this.formBuilder.group({
      id: [0],
      allergies: ['', Validators.required],
      pastSurgeries: [''],
      chronicConditions: ['', Validators.required],
      medicalHistory: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      modifyBy: [''],
      modifyDate: [''],
      status: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form controls
  get f() {
    return this.medicalHistoryForm.controls;
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

  loadMedicalHistories(page: number = this.currentPage, size: number = this.pageSize) {
    this.isLoadingMedicalHistory = true;
    this.medicalHistoryService.getAllMedicalHistories(page, size).subscribe({
      next: (response) => {
        console.log('Medical Histories:', response);
        this.medicalHistories = response.data.dataList;

        this.currentPage = response.data.pageNumber;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.hasNext = response.data.hasNext;
        this.hasPrevious = response.data.hasPrevious;

        this.isLoadingMedicalHistory = false;
      },
      error: (error) => {
        console.error('Error loading medical histories:', error);
        this.isLoadingMedicalHistory = false;
      }
    });
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadMedicalHistories(page, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadMedicalHistories(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadMedicalHistories(this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0;
    this.loadMedicalHistories(this.currentPage, this.pageSize);
  }

  // Save or update
  saveMedicalHistory() {
    if (this.medicalHistoryForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    const formData = this.medicalHistoryForm.value;

    if (this.editingMedicalHistoryId) {
      this.medicalHistoryService.createMedicalHistory(this.editingMedicalHistoryId, formData).subscribe({
        next: (response) => {
          console.log('Medical history updated:', response);
          this.loadMedicalHistories();
          this.resetForm();
        },
        error: (error) => console.error('Error updating:', error)
      });
    } 
    
  }

  GetMedicalHistoryById(id: number) {
    this.medicalHistoryService.GetMedicalHistoryById(id).subscribe({
      next: (medicalHistory) => {
        // Populate form with medicalHistory data for editing
        this.medicalHistoryForm.patchValue({
          id: medicalHistory.data.id,
          allergies: medicalHistory.data.allergies,
          pastSurgeries: medicalHistory.data.pastSurgeries,
          chronicConditions: medicalHistory.data.chronicConditions,
          medicalHistory: medicalHistory.data.medicalHistory,
          createdBy: medicalHistory.data.createdBy,
          createdDate: medicalHistory.data.createdDate,
          modifyBy: medicalHistory.data.modifyBy,
          modifyDate: medicalHistory.data.modifyDate,
          status: medicalHistory.data.status?.id || medicalHistory.data.status
        });
        this.isEdit = true;
        this.editingMedicalHistoryId = medicalHistory.data.id;
      },
      error: (error) => console.error('Error loading by ID:', error)
    });
  }

  deleteById(id: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.medicalHistoryService.DeleteMedicalHistoryById(id).subscribe({
        next: (response) => {
          console.log('Deleted:', response);
          this.loadMedicalHistories(this.currentPage, this.pageSize);
        },
        error: (error) => console.error('Error deleting:', error)
      });
    }
  }

  resetForm() {
    this.medicalHistoryForm.reset({
      id: 0,
      allergies: '',
      pastSurgeries: '',
      chronicConditions: '',
      medicalHistory: '',
      createdBy: '',
      createdDate: '',
      modifyBy: '',
      modifyDate: '',
      status: ''
    });
    this.isEdit = false;
    this.editingMedicalHistoryId = null;
  }

  private markFormGroupTouched() {
    Object.keys(this.medicalHistoryForm.controls).forEach(key => {
      const control = this.medicalHistoryForm.get(key);
      control?.markAsTouched();
    });
  }
}