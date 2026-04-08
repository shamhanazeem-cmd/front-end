import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../services/api/payment/payment.service';
import { StatusService } from '../services/api/status/status.service';
import { AppointmentService } from '../services/api/appointment/appointment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  paymentForm!: FormGroup;
  payments: any[] = [];
  isEditPayment: boolean = false;
  editingPaymentId: number | null = null;
  isLoadingPayment: boolean = false;

  allStatuses: any[] = [];
  allAppointments: any[] = [];

  // Pagination properties
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private statusService: StatusService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.loadPayments();
    this.loadStatuses();
    this.loadAppointments();
  }

  initFormGroup() {
    this.paymentForm = this.formBuilder.group({
      id: [0],
      paymentSerialID: ['', Validators.required],
      hospitalCharge: ['', Validators.required],
      doctorCharge: ['', Validators.required],
      tax: ['', Validators.required],
      amount: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      paymentDate: ['', Validators.required],
      createdBy: [{ value: '', disabled: true }],
      createdDate: [{ value: '', disabled: true }],
      modifyBy: [{ value: '', disabled: true }],
      modifyDate: [{ value: '', disabled: true }],
      status: ['', Validators.required],
      appointment: ['', Validators.required]
    });
  }

  get f() {
    return this.paymentForm.controls;
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

  loadAppointments() {
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

  loadPayments(page: number = this.currentPage, size: number = this.pageSize) {
    this.isLoadingPayment = true;
    this.paymentService.getAllPayments(page, size).subscribe({
      next: (response) => {
        this.payments = response.data.dataList;

        this.currentPage = response.data.pageNumber;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.hasNext = response.data.hasNext;
        this.hasPrevious = response.data.hasPrevious;

        this.isLoadingPayment = false;
      },
      error: () => {
        this.isLoadingPayment = false;
      }
    });
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadPayments(page, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadPayments(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadPayments(this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0;
    this.loadPayments(this.currentPage, this.pageSize);
  }


  savePayment() {
    if (this.paymentForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formdata = this.paymentForm.value;

    if (this.isEditPayment && this.editingPaymentId !== null) {

      this.paymentService
        .createPayment(this.editingPaymentId, formdata)
        .subscribe({
          next: () => {
            this.loadPayments();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    } else {
      this.paymentService
        .createPayment(formdata, 'Add')
        .subscribe({
          next: () => {
            this.loadPayments();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    }
  }

  getPaymentById(id: number) {
    this.paymentService.getPaymentById(id).subscribe({
      next: (res) => {
        const pay = res.data;

        this.paymentForm.patchValue({
          id: pay.id,
          paymentSerialID: pay.paymentSerialID,
          hospitalCharge: pay.hospitalCharge,
          doctorCharge: pay.doctorCharge,
          tax: pay.tax,
          amount: pay.amount,
          paymentMethod: pay.paymentMethod,
          paymentDate: pay.paymentDate,
          createdBy: pay.createdBy,
          createdDate: pay.createdDate,
          modifyBy: pay.modifyBy,
          modifyDate: pay.modifyDate,
          status: pay.status?.id || pay.status,
          appointment: pay.appointment?.id || pay.appointment
        });

        this.isEditPayment = true;
        this.editingPaymentId = pay.id;
      },
      error: (err) => console.error(err)
    });
  }

  deleteById(id: number) {
    if (confirm('Are you sure you want to delete this payment?')) {
      this.paymentService.deletePaymentById(id).subscribe({
        next: () => {
          this.loadPayments(this.currentPage, this.pageSize);
        },
        error: (error) => console.error(error)
      });
    }
  }

  resetForm() {
    this.paymentForm.reset({
      id: 0,
      paymentSerialID: '',
      hospitalCharge: 0,
      doctorCharge: 0,
      tax: 0,
      amount: 0,
      paymentMethod: '',
      paymentDate: '',
      createdBy: '',
      createdDate: '',
      modifyBy: '',
      modifyDate: '',
      status: '',
      appointment: ''
    });

    this.isEditPayment = false;
    this.editingPaymentId = null;
  }

  private markFormGroupTouched() {
    Object.values(this.paymentForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }




}
