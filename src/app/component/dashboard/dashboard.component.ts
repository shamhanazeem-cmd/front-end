import { Component } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  ngOnInit(){
    this.chartView();
    }

    chartView(){
      (async function() {
        const data = [
          { 
            year: 2010,
            count: 40 
          },
          { 
            year: 2011,
            count: 169 
          },
          { 
            year: 2012,
            count: 82
          },{ 
            year: 2014,
            count: 150
          }
          ,{ 
            year: 2015,
            count: 220
          }
          ,{ 
            year: 2016,
            count: 400
          }
        ];
      
        new Chart(
           document.getElementById('myChart1') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: data.map(row => row.year),
              datasets: [
                {
                  label: 'Enrollment by Year',
                  data: data.map(row => row.count)
                }
              ]
            }
          }
        );

        new Chart(
          document.getElementById('myChart2') as HTMLCanvasElement,
         {
           type: 'bar',
           data: {
             labels: data.map(row => row.year),
             datasets: [
               {
                 label: 'Marks by Year',
                 data: data.map(row => row.count)
               }
             ]
           }
         }
       );
      })();
    }

}
