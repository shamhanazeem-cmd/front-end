import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RfqService } from '../services/api/rfq/rfq.service';
import { StatusService } from '../services/api/status/status.service';

@Component({
  selector: 'app-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.scss']
})
export class RfqComponent implements OnInit {
  rfqForm!: FormGroup;
  rfqs: any[] = [];
  allStatuses: any[] = [];

  isEditRFQ: boolean = false;
  editingRFQId: string | null = null;
  isLoadingRFQs: boolean = false;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private rfqService: RfqService,
    private statusService: StatusService
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.loadRFQs();
    this.loadStatus();
  }

  initFormGroup() {
    this.rfqForm = this.formBuilder.group({
  rfqNumber: ['', Validators.required],
  rfqRequestDate: [new Date(), Validators.required], // Note the 'rfq' prefix
  rfqRequestedBy: ['', Validators.required],
  rfqRequiredDate: ['', Validators.required],
  status: [1],
  createdBy: ['Admin'],
  createdDate: [new Date()],
  modifyBy: ['Admin'],
  modifyDate: [new Date()],
  rfqDetails: this.formBuilder.array([]) // Note: Must be 'rfqDetails' to match Postman
});
  }

  // Helper to access the form array
  get rfqDetails(): FormArray {
    return this.rfqForm.get('rfqDetails') as FormArray;
  }

  // Add a new row to the details array
  addDetailRow(data: any = null) {
    const detailGroup = this.formBuilder.group({
      item: [data ? data.item : ''],
      quantity: [data ? data.quantity : 0],
      remarks: [data ? data.remarks : '']
    });
    this.rfqDetails.push(detailGroup);
  }

  removeDetailRow(index: number) {
    this.rfqDetails.removeAt(index);
  }

  get f() {
    return this.rfqForm.controls;
  } GetAllRfqs() {

  }


  // Load statuses
  loadStatus() {
    this.statusService.GetAllStatus().subscribe({
      next: (response) => {
        console.log("Data ", response);

        this.allStatuses = response.data?.dataList || response.data || response;
      },
      error: (error) => {
        console.error('Error loading statuses:', error);
        this.allStatuses = [];
      }
    });
  }

  loadRFQs(page: number = this.currentPage, size: number = this.pageSize) {
    this.isLoadingRFQs = true;
    this.rfqService.getAllRFQs(page, size).subscribe({
      next: (response) => {
        this.rfqs = response.data.dataList;
        this.currentPage = response.data.currentPage; // Ensure this matches your DTO
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.hasNext = response.data.hasNext;
        this.hasPrevious = response.data.hasPrevious;
        this.isLoadingRFQs = false;
      }
    });
  }

   goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadRFQs(page, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadRFQs(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadRFQs(this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0;
    this.loadRFQs(this.currentPage, this.pageSize);
  }

   SaveRFQ() {
    if (this.rfqForm.invalid) {
      this.markFormGroupTouched(this.rfqForm);
      return;
    }

    const formData = this.rfqForm.value;
    console.log("Data :", formData);

    console.log("JSON being sent to Spring Boot:", JSON.stringify(formData, null, 2));

    if (this.isEditRFQ && this.editingRFQId !== null) {

      this.rfqService
        .createRFQ(this.editingRFQId, formData)
        .subscribe({
          next: () => {
            this.loadRFQs();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    } else {
      this.rfqService
        .createRFQ(formData, 'Add')
        .subscribe({
          next: () => {
            this.loadRFQs();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    }
  }

  GetRFQById(id: string) {
    this.rfqService.getRfqById(id).subscribe({
      next: (res) => {
        const data = res.data;
        this.rfqForm.patchValue({
          id: data.id,
          rfqNumber: data.rfqNumber,
          requestedBy: data.requestedBy,
          requiredDate: data.requiredDate,
          status: data.status?.id
        });

        this.rfqDetails.clear(); 
        if (data.details && data.details.length > 0) {
          data.details.forEach((d: any) => this.addDetailRow(d));
        }

        this.isEditRFQ = true;
        this.editingRFQId = id;
      }
    });
  }

   DeleteById(id: string) {
    if (confirm('Are you sure you want to delete this RFQ?')) {
      this.rfqService.deleteRfqById(id).subscribe({
        next: (response) => {
          console.log('RFQ deleted:', response);
          this.loadRFQs(this.currentPage, this.pageSize);
        },
        error: (error) => {
          console.error('Error deleting RFQ:', error);
        }
      });
    }
  }

  resetForm() {
  this.rfqForm.reset({
    id: 0,
    rfqNumber: '',
    requestedBy: '',
    requestedDate:'',
    requiredDate: '',
    status: '',
    createdBy: '',
    createdDate: '',
    modifyBy: '',
    modifyDate: ''
  });

  this.rfqDetails.clear();
  this.isEditRFQ = false;
  this.editingRFQId = null;
}

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();

    // If the control is another group or array, go deeper (recursive)
    if (control instanceof FormGroup || control instanceof FormArray) {
      this.markFormGroupTouched(control);
    }
  });
}



}
