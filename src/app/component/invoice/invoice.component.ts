import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../services/api/invoice/invoice.service';
import { StatusService } from '../services/api/status/status.service';
import { PaymentService } from '../services/api/payment/payment.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})

export class InvoiceComponent implements OnInit {
  invoiceForm!: FormGroup;
  invoices: any[] = [];

  isEdit: boolean = false;
  editingInvoiceId: number | null = null;
  isLoadingInvoices: boolean = false;

  allStatuses: any[] = [];
  allPayments: any[] = [];

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private invoiceService: InvoiceService,
    private statusService: StatusService,
    private paymentService: PaymentService,
  ) { }


  ngOnInit(): void {
    this.initFormGroup();
    this.loadInvoices();
    this.loadStatus();
    this.loadPayments();


  }

  initFormGroup() {
    this.invoiceForm = this.formBuilder.group({
      id: [0],
      invoiceNumber: ['', Validators.required],
      issuedDate: ['', Validators.required],
      totalAmount: ['', Validators.required],

      createdBy: [{ value: '', disabled: true }],
      createdDate: [{ value: '', disabled: true }],
      modifyBy: [{ value: '', disabled: true }],
      modifyDate: [{ value: '', disabled: true }],

      payment: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  get f() {
    return this.invoiceForm.controls;
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

  // Load Payments
  loadPayments() {
    this.paymentService.getAllPayments().subscribe({
      next: (response) => {
        this.allPayments = response.data?.dataList || response.data || response;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.allPayments = [];
      }
    });
  }

  // Load Invoices
  loadInvoices(page: number = this.currentPage, size: number = this.pageSize) {
    this.isLoadingInvoices = true;

    this.invoiceService.getAllInvoices(page, size).subscribe({
      next: (response) => {

        this.invoices = response.data.dataList;

        this.currentPage = response.data.pageNumber;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.hasNext = response.data.hasNext;
        this.hasPrevious = response.data.hasPrevious;

        this.isLoadingInvoices = false;
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.isLoadingInvoices = false;
      }
    });
  }

  // Pagination controls
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadInvoices(page, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadInvoices(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadInvoices(this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0;
    this.loadInvoices(this.currentPage, this.pageSize);
  }

  // Save / Update
  saveInvoice() {

    if (this.invoiceForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.invoiceForm.value;

    if (this.isEdit && this.editingInvoiceId !== null) {

      this.invoiceService
        .createInvoice(this.editingInvoiceId, formData)
        .subscribe({
          next: () => {
            this.loadInvoices();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    } else {
      this.invoiceService
        .createInvoice(formData, 'Add')
        .subscribe({
          next: () => {
            this.loadInvoices();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    }
  }

  // Get by ID
  getInvoiceById(id: number) {

    this.invoiceService.getInvoiceById(id).subscribe({
      next: (response) => {

        const invoice = response.data;

        this.invoiceForm.patchValue({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          issuedDate: invoice.issuedDate,
          totalAmount: invoice.totalAmount,

          createdBy: invoice.createdBy,
          createdDate: invoice.createdDate,
          modifyBy: invoice.modifyBy,
          modifyDate: invoice.modifyDate,

          payment: invoice.payment?.id || invoice.payment,
          status: invoice.status?.id || invoice.status
        });

        this.isEdit = true;
        this.editingInvoiceId = invoice.id;

      },
      error: (error) => console.error('Error loading invoice:', error)
    });
  }

  // Delete
  deleteById(id: number) {

    if (confirm('Are you sure you want to delete this invoice?')) {

      this.invoiceService.deleteInvoiceById(id).subscribe({
        next: (response) => {
          console.log('Invoice deleted:', response);
          this.loadInvoices(this.currentPage, this.pageSize);
        },
        error: (error) => console.error('Error deleting invoice:', error)
      });

    }
  }

  // Reset
  resetForm() {

    this.invoiceForm.reset({
      id: 0,
      invoiceNumber: '',
      issuedDate: '',
      totalAmount: '',
      createdBy: '',
      createdDate: '',
      modifyBy: '',
      modifyDate: '',
      payment: '',
      status: ''
    });

    this.isEdit = false;
    this.editingInvoiceId = null;
  }

  private markFormGroupTouched() {

    Object.keys(this.invoiceForm.controls).forEach(key => {
      const control = this.invoiceForm.get(key);
      control?.markAsTouched();
    });

  }
}
