import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {
  private baseUrl: string = 'http://localhost:8010/api/v1/medication';

  constructor(
        private http: HttpClient
    
  ) { }
  createMedication(medication: any, type: any): Observable<any> {
      if (type == 'Add') {
        return this.http.post(this.baseUrl, medication);
      } else {
        return this.http.put(this.baseUrl + "/" + medication.id, medication);
      }
  
    }
  
    getAllMedication(page: number = 0, size: number = 10): Observable<any> {
        let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());
    
        return this.http.get<any>(this.baseUrl, { params });
      }
      
  
    GetAllMedication(page: number, size: number): Observable<any> {
      return this.http.get(this.baseUrl);
    }
  
    GetMedicationById(ID: any): Observable<any> {
      return this.http.get(this.baseUrl + "/" + ID);
    }
  
    DeleteMedicationById(ID: any): Observable<any> {
      return this.http.delete(this.baseUrl + "/" + ID)
    }
}
