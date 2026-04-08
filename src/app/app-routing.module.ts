import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './component/student/student.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { CourseComponent } from './component/course/course.component';
import { TeacherComponent } from './component/teacher/teacher.component';
import { ClassComponent } from './component/class/class.component';
import { InstituteLoginComponent } from './component/institute-login/institute-login.component';
import { ForbiddenComponent } from './component/forbidden/forbidden.component';
import { AuthGuard } from './component/auth/auth.guard';
import { PrivilegeComponent } from './component/privilege/privilege.component';
import { MedicalHistoryComponent } from './component/medicalhistory/medicalhistory.component';
import { PatientComponent } from './component/patient/patient.component';
import { SpecializationComponent } from './component/specialization/specialization.component';
import { DoctorComponent } from './component/doctor/doctor.component';
import { ScheduleComponent } from './component/schedule/schedule.component';
import { AppointmentComponent } from './component/appointment/appointment.component';
import { PrescriptionComponent } from './component/prescription/prescription.component';
import { NotificationComponent } from './component/notification/notification.component';
import { MedicationComponent } from './component/medication/medication.component';
import { PaymentComponent } from './component/payment/payment.component';
import { InvoiceComponent } from './component/invoice/invoice.component'

const routes: Routes = [

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'user'] } },

  { path: 'appointment', component: AppointmentComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'user'] } },

  { path: 'student', component: StudentComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'medicalhistory', component: MedicalHistoryComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'invoice', component: InvoiceComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'medication', component: MedicationComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'patient', component: PatientComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'doctor', component: DoctorComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'prescription', component: PrescriptionComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'specialization', component: SpecializationComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'course', component: CourseComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'teacher', component: TeacherComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'class', component: ClassComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'login', component: InstituteLoginComponent },

  { path: 'forbidden', component: ForbiddenComponent },


  { path: 'privilege', component: PrivilegeComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'user'] } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
