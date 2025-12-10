import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private baseUrl: string = 'http://localhost:8010/api/v1/appointment';

  constructor(
            private http: HttpClient 
  ) { }


     createAppointment(appointment: any, type: any): Observable<any> {
       if (type == 'Add') {
         return this.http.post(this.baseUrl, appointment);
       } else {
         return this.http.put(this.baseUrl + "/" + appointment.id, appointment);
       }
   
     }
   
     getAllAppointments(page: number = 0, size: number = 10): Observable<any> {
         let params = new HttpParams()
           .set('page', page.toString())
           .set('size', size.toString());
     
         return this.http.get<any>(this.baseUrl, { params });
       }
       
   
     GetAllAppointment(): Observable<any> {
       return this.http.get(this.baseUrl);
     }
   
     getAppointmentById(ID: any): Observable<any> {
       return this.http.get(this.baseUrl + "/" + ID);
     }
   
     deleteAppointmentById(ID: any): Observable<any> {
       return this.http.delete(this.baseUrl + "/" + ID)
     }

}
