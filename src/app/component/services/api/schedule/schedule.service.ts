import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private baseUrl: string = 'http://localhost:8010/api/v1/schedule';

  constructor(
     private http: HttpClient
  ) { }

  createSchedule(schedule: any, type: any): Observable<any> {
      if (type == 'Add') {
        return this.http.post(this.baseUrl, schedule);
      } else {
        console.log(schedule);
  
        return this.http.put(this.baseUrl + "/" + schedule.id, schedule);
      }
  
    }
  
    getAllSchedules(page: number = 0, size: number = 10): Observable<any> {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
  
      return this.http.get<any>(this.baseUrl, { params });
    }
  
    
    GetAllSchedule(): Observable<any> {
      return this.http.get(this.baseUrl);
    }
  
    getScheduleById(ID: any): Observable<any> {
      return this.http.get(this.baseUrl + "/" + ID);
    }
  
    deleteScheduleById(ID: any): Observable<any> {
      return this.http.delete(this.baseUrl + "/" + ID)
    }
}
