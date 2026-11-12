
import { Component } from '@angular/core';
import { AppointmentService } from 'src/app/component/services/api/appointment/appointment.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-report-appointment',
  templateUrl: './report-appointment.component.html',
  styleUrls: ['./report-appointment.component.scss']
})
export class ReportAppointmentComponent {

  appointmentData: any[] = [];
  totalAppointments: number = 0;
  chart: any;

  constructor(
    private appointmentService: AppointmentService
  ) { }

  ngOnInit() {
    this.loadAppointmentData();
  }

  loadAppointmentData() {

    this.appointmentService.getAppointmentCountByDoctor().subscribe({

      next: (response: any) => {

        console.log("Appointment Report:", response);

        if (response.code === 200) {

          this.appointmentData = response.data;

          this.calculateTotals();

          this.createChart();

        } else {

          console.error('Error loading data:', response.message);

          // Use sample data if API returns error
          this.useSampleData();

        }

      },

      error: (error) => {

        console.error('API Error:', error);

        // Use sample data if API fails
        this.useSampleData();

      }

    });

  }

  calculateTotals() {

    this.totalAppointments = this.appointmentData.reduce((sum, item) => {
      return sum + Number(item.appointmentCount);
    }, 0);

  }

  createChart() {

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const doctorNames = this.appointmentData.map(
      item => item.doctorName
    );

    const counts = this.appointmentData.map(
      item => item.appointmentCount
    );

    this.chart = new Chart(
      document.getElementById('appointmentChart') as HTMLCanvasElement,
      {
        type: 'bar',

        data: {

          labels: doctorNames,

          datasets: [{
            label: 'Appointments Per Doctor',
            data: counts,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]

        },

        options: {

          responsive: true,

          scales: {

            y: {
              beginAtZero: true,

              ticks: {
                precision: 0
              },

              title: {
                display: true,
                text: 'Number of Appointments'
              }
            },

            x: {
              title: {
                display: true,
                text: 'Doctor Name'
              }
            }

          }

        }

      }

    );

  }

  // Backup sample data if API fails
  useSampleData() {

    this.appointmentData = [
      { doctorName: 'Dr. Silva', appointmentCount: 15 },
      { doctorName: 'Dr. Perera', appointmentCount: 20 },
      { doctorName: 'Dr. Fernando', appointmentCount: 12 },
      { doctorName: 'Dr. Kumar', appointmentCount: 8 }
    ];

    this.calculateTotals();

    this.createChart();

  }

}
