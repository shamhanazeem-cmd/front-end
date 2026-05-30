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
    this.createStatusChart();
    this.createLoadChart();
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


  createStatusChart() {
    new Chart("statusChart", {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          { label: 'Confirmed', data: [30, 38, 32, 45, 35], backgroundColor: '#2886dd' }, // Green
          { label: 'Pending', data: [8, 12, 10, 8, 10], backgroundColor: '#d69a2c '},    // Orange
          { label: 'Cancelled', data: [5, 3, 5, 2, 4], backgroundColor: '#d44b4b' }     // Red
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }
      }
    });
  }

  createLoadChart() {
    new Chart("loadChart", {
      type: 'bar',
      data: {
        labels: ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'],
        datasets: [{
          label: 'Patients',
          data: [3, 7, 9, 8, 5, 6, 8, 7, 4],
          backgroundColor: '#67a1d7', 
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}


