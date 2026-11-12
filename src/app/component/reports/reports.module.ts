import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportPatientComponent } from './report-patient/report-patient.component';
import { ReportAppointmentComponent } from './report-appointment/report-appointment/report-appointment.component';


@NgModule({
  declarations: [
    ReportPatientComponent,
    ReportAppointmentComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
