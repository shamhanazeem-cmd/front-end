import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecializationService } from '../services/api/specialization/specialization.service';

@Component({
  selector: 'app-specialization',
  templateUrl: './specialization.component.html',
  styleUrls: ['./specialization.component.scss']
})
export class SpecializationComponent implements OnInit {
  specializationForm!: FormGroup;
  specializations: any[] = [];
  isEdit: boolean = false; // Add this property
  editingSpecializationId: string | null = null;
  isLoadingSpecializations: boolean = false;

  // Pagination properties
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private specializationService: SpecializationService
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.loadSpecializations();
  }

  initFormGroup() {
    this.specializationForm = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      description: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      modifyBy: [''],
      modifyDate: ['']
    });
  }

  loadSpecializations(page: number = this.currentPage, size: number = this.pageSize) {
    this.isLoadingSpecializations = true;
    this.specializationService.getAllSpecializations(page, size).subscribe({
      next: (response) => {
        this.specializations = response.data.dataList || [];
        this.currentPage = response.data.pageNumber || 0;
        this.totalPages = response.data.totalPages || 0;
        this.totalElements = response.data.totalElements || 0;
        this.hasNext = response.data.hasNext || false;
        this.hasPrevious = response.data.hasPrevious || false;
        this.isLoadingSpecializations = false;
      },
      error: (error) => {
        console.error('Error loading specializations:', error);
        this.isLoadingSpecializations = false;
      }
    });
  }

  SaveSpecialization() {
    if (this.specializationForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.specializationForm.value;

    if (this.isEdit && this.editingSpecializationId) {
      // Update existing specialization
      this.specializationService.createSpecialization(this.editingSpecializationId, formData).subscribe({
        next: (response) => {
          console.log('Specialization updated:', response);
          this.loadSpecializations();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating specialization:', error);
        }
      });
    }
  }

  GetSpecializationById(id: string) {
    this.specializationService.getSpecializationById(id).subscribe({
      next: (specialization) => {
        // Populate form with specialization data for editing
        this.specializationForm.patchValue({
          id: specialization.data.id,
          name: specialization.data.name,
          description: specialization.data.description,
          createdBy: specialization.data.createdBy,
          createdDate: specialization.data.createdDate,
          modifyBy: specialization.data.modifyBy,
          modifyDate: specialization.data.modifyDate
        });
        this.isEdit = true;
        this.editingSpecializationId = id;
      },
      error: (error) => {
        console.error('Error fetching specialization:', error);
      }
    });
  }

  DeleteById(id: string) {
    if (confirm('Are you sure you want to delete this specialization?')) {
      this.specializationService.deleteSpecializationById(id).subscribe({
        next: (response) => {
          console.log('Specialization deleted:', response);
          this.loadSpecializations(this.currentPage, this.pageSize);
        },
        error: (error) => {
          console.error('Error deleting specialization:', error);
        }
      });
    }
  }

  resetForm() {
    this.specializationForm.reset({
      id: 0,
      name: '',
      description: '',
      createdBy: '',
      createdDate: '',
      modifyBy: '',
      modifyDate: ''
    });
    this.isEdit = false;
    this.editingSpecializationId = null;
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadSpecializations(page, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadSpecializations(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadSpecializations(this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0;
    this.loadSpecializations(this.currentPage, this.pageSize);
  }

  private markFormGroupTouched() {
    Object.keys(this.specializationForm.controls).forEach(key => {
      const control = this.specializationForm.get(key);
      control?.markAsTouched();
    });
  }
}