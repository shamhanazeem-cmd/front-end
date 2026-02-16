import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartserviceService {

  employeeApi = 'http://your-api/employee/chart';
  customerApi = 'http://your-api/customer/chart';

  constructor(private http: HttpClient) {}

  getEmployeeChart() {
    return this.http.get<any[]>(this.employeeApi);
  }

  getCustomerChart() {
    return this.http.get<any[]>(this.customerApi);
  }
}

