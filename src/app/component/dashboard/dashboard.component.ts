import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { forkJoin } from 'rxjs';
import { ChartserviceService } from '../services/api/chats/chartservice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  employeeChart!: Chart;
  customerChart!: Chart;
    constructor(private chartService: ChartserviceService) {}
  ngOnInit(){
    this.loadDashboard();
    }

  loadDashboard() {

    forkJoin({
      employee: this.chartService.getEmployeeChart(),
      customer: this.chartService.getCustomerChart()
    }).subscribe({
      next: (res) => {
        this.createEmployeeChart(res.employee);
        this.createCustomerChart(res.customer);
      },
      error: (err) => {
        console.error('Dashboard load failed', err);
      }
    });
  }

  createEmployeeChart(data: any[]) {

    const years = data.map(d => d.year);
    const counts = data.map(d => d.count);

    this.employeeChart = new Chart(
      document.getElementById('myChart1') as HTMLCanvasElement,
      {
        type: 'line',
        data: {
          labels: years,
          datasets: [
            {
              label: 'Employee Enrollment',
              data: counts
            }
          ]
        }
      }
    );
  }

  createCustomerChart(data: any[]) {

    const years = data.map(d => d.year);
    const counts = data.map(d => d.count);

    this.customerChart = new Chart(
      document.getElementById('myChart2') as HTMLCanvasElement,
      {
        type: 'bar',
        data: {
          labels: years,
          datasets: [
            {
              label: 'Customer Growth',
              data: counts
            }
          ]
        }
      }
    );
  }

}
