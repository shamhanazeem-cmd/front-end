import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicationService } from '../services/api/medication/medication.service';
import { StatusService } from '../services/api/status/status.service';
import { PrescriptionService } from '../services/api/prescription/prescription.service';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.scss']
})
export class MedicationComponent implements OnInit {
  
  medicationForm!: FormGroup;
  medications: any[] = [];
  isEdit: boolean = false;
  editingMedicationId: number | null = null;
  isLoadingMedication: boolean = false;

  allStatuses: any[] = [];
  allPrescriptions: any[] = [];

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private medicationService: MedicationService,
    private statusService: StatusService,
    private prescriptionService: PrescriptionService
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.loadMedications();
    this.loadStatuses();
    this.loadPrescriptions();
  }

  initFormGroup() {
    this.medicationForm = this.formBuilder.group({
      id: [0],
      drugName: ['', Validators.required],
      dosage: ['', Validators.required],
      duration: ['', Validators.required],
      instructions: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      modifyBy: [''],
      modifyDate: [''],
      status: ['', Validators.required],
      prescription: ['', Validators.required]
    });
  }

  get f() {
    return this.medicationForm.controls;
  }

  // Load Status List
  loadStatuses() {
    this.statusService.GetAllStatus().subscribe({
      next: (response) => {
        this.allStatuses = response.data?.dataList || response.data || response;
      },
      error: () => {
        this.allStatuses = [];
      }
    });
  } 


    // Load Prescription Dropdown
  loadPrescriptions() {
    this.prescriptionService.getAllPrescription().subscribe({
      next: (response) => {
        this.allPrescriptions = response.data?.dataList || response.data || response;
      },
      error: () => {
        this.allPrescriptions = [];
      }
    });
  }

  // Load Medications (Paginated)
  loadMedications(page: number = this.currentPage, size: number = this.pageSize) {
    this.isLoadingMedication = true;
    this.medicationService.GetAllMedication(page, size).subscribe({
      next: (response) => {
        this.medications = response.data.dataList;

        this.currentPage = response.data.pageNumber;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.hasNext = response.data.hasNext;
        this.hasPrevious = response.data.hasPrevious;

        this.isLoadingMedication = false;
      },
      error: () => {
        this.isLoadingMedication = false;
      }
    });
  }

  
  // Pagination controls
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadMedications(page, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadMedications(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadMedications(this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0;
    this.loadMedications(this.currentPage, this.pageSize);
  }

   // Create or Update Medication
  saveMedication() {
    if (this.medicationForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
      const formData = this.medicationForm.value;

  if (this.isEdit && this.editingMedicationId !== null) {

      this.medicationService
        .createMedication(this.editingMedicationId, formData)
        .subscribe({
          next: () => {
            this.loadMedications();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    }else {
      this.medicationService
        .createMedication(formData, 'Add')
        .subscribe({
          next: () => {
            this.loadMedications();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    }
  }

  // Load data for editing
  getMedicationById(id: number) {
    this.medicationService.GetMedicationById(id).subscribe({
      next: (response) => {
        const m = response.data;

        this.medicationForm.patchValue({
          id: m.id,
          drugName: m.drugName,
          dosage: m.dosage,
          duration: m.duration,
          instructions: m.instructions,
          createdBy: m.createdBy,
          createdDate: m.createdDate,
          modifyBy: m.modifyBy,
          modifyDate: m.modifyDate,
          status: m.status?.id,
          prescription: m.prescription?.id
        });

        this.isEdit = true;
        this.editingMedicationId = m.id;
      },
      error: (error) => console.error('Error loading medication:', error)
    });
  }

  deleteById(id: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.medicationService.DeleteMedicationById(id).subscribe({
        next: () => {
          this.loadMedications(this.currentPage, this.pageSize);
        },
        error: (error) => console.error('Error deleting medication:', error)
      });
    }
  }

  resetForm() {
    this.medicationForm.reset({
      id: 0,
      drugName: '',
      dosage: '',
      duration: '',
      instructions: '',
      createdBy: '',
      createdDate: '',
      modifyBy: '',
      modifyDate: '',
      status: '',
      prescription: ''
    });

    this.isEdit = false;
    this.editingMedicationId = null;
  }

  private markFormGroupTouched() {
    Object.keys(this.medicationForm.controls).forEach(key => {
      const control = this.medicationForm.get(key);
      control?.markAsTouched();
    });
  }



}
