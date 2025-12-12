import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private baseUrl: string = 'http://localhost:8010/api/v1/prescription';
  constructor(
        private http: HttpClient
    
  ) { }

  createPrescription(prescription: any, type: any): Observable<any> {
      if (type == 'Add') {
        return this.http.post(this.baseUrl, prescription);
      } else {
        return this.http.put(this.baseUrl + "/" + prescription.id, prescription);
      }
  
    }
  
    getAllPrescription(page: number = 0, size: number = 10): Observable<any> {
        let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());
    
        return this.http.get<any>(this.baseUrl, { params });
      }
      
  
    GetAllPrescription(): Observable<any> {
      return this.http.get(this.baseUrl);
    }
  
    GetPrescriptionById(ID: any): Observable<any> {
      return this.http.get(this.baseUrl + "/" + ID);
    }
  
    DeletePrescriptionById(ID: any): Observable<any> {
      return this.http.delete(this.baseUrl + "/" + ID)
    }
}
