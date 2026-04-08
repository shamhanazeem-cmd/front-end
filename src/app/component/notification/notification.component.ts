import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../services/api/notification/notification.service';
import { StatusService } from '../services/api/status/status.service';
import { AppointmentService } from '../services/api/appointment/appointment.service';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notificationForm!: FormGroup;
  notifications: any[] = [];
  isEdit: boolean = false;
  editingNotificationId: number | null = null;
  isLoadingNotification: boolean = false;
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
    private notificationService: NotificationService,
    private statusService: StatusService,
    private appointmentService: AppointmentService

  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.loadNotifications();
    this.loadStatuses();
    this.loadAppointments();

  }

  initFormGroup() {
    this.notificationForm = this.formBuilder.group({
      id: [0],
      sentDate: ['', Validators.required],
      channel: ['', Validators.required],
      createdBy: [{ value: '', disabled: true }],
      createdDate: [{ value: '', disabled: true }],
      modifyBy: [{ value: '', disabled: true }],
      modifyDate: [{ value: '', disabled: true }],
      appointment: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  get f() {
    return this.notificationForm.controls;
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

  loadNotifications(page: number = this.currentPage, size: number = this.pageSize) {
    this.isLoadingNotification = true;
    this.notificationService.getAllNotification(page, size).subscribe({
      next: (response) => {
        console.log('Notification:', response);
        this.notifications = response.data.dataList;

        this.currentPage = response.data.pageNumber;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.hasNext = response.data.hasNext;
        this.hasPrevious = response.data.hasPrevious;

        this.isLoadingNotification = false;
      },
      error: (error) => {
        console.error('Error loading Notification:', error);
        this.isLoadingNotification = false;
      }
    });
  }


  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadNotifications(page, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadNotifications(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadNotifications(this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0;
    this.loadNotifications(this.currentPage, this.pageSize);
  }

  saveNotification() {
    if (this.notificationForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formdata = this.notificationForm.value;

    if (this.isEdit && this.editingNotificationId !== null) {

      this.notificationService
        .createNotification(this.editingNotificationId, formdata)
        .subscribe({
          next: () => {
            this.loadNotifications();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    } else {
      this.notificationService
        .createNotification(formdata, 'Add')
        .subscribe({
          next: () => {
            this.loadNotifications();
            this.resetForm();
          },
          error: err => console.error(err)
        });
    }
  }

  getNotificationById(id: number) {
    this.notificationService.GetNotificationById(id).subscribe({
      next: (res) => {
        const ntf = res.data;

        this.notificationForm.patchValue({
          id: ntf.id,
          sentDate: ntf.sentDate,
          channel: ntf.channel,
          createdBy: ntf.createdBy,
          createdDate: ntf.createdDate,
          modifyBy: ntf.modifyBy,
          modifyDate: ntf.modifyDate,
          appointment: ntf.appointment?.id || ntf.appointment,
          status: ntf.status?.id || ntf.status
        });

        this.isEdit = true;
        this.editingNotificationId = ntf.id;
      },
      error: (err) => console.error(err)
    });
  }

  deleteById(id: number) {
    if (confirm("Are you sure you want to delete this notification?")) {
      this.notificationService.DeleteNotificationById(id).subscribe({
        next: (response) => {
          console.log('Deleted:', response);
          this.loadNotifications(this.currentPage, this.pageSize);
        },
        error: (error) => console.error('Error deleting:', error)
      });
    }
  }

  resetForm() {
    this.notificationForm.reset({
      id: 0,
      sentDate: '',
      channel: '',
      createdBy: '',
      createdDate: '',
      modifyBy: '',
      modifyDate: '',
      appointment: '',
      status: ''
    });

    this.isEdit = false;
    this.editingNotificationId = null;
  }

  private markFormGroupTouched() {
    Object.values(this.notificationForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
