import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalhistoyService {
  private baseUrl: string = 'http://localhost:8010/api/v1/medicalhistory';
  constructor(
    private http: HttpClient
  ) { }


  createMedicalHistory(medicalHistory: any, type: any): Observable<any> {
    if (type == 'Add') {
      return this.http.post(this.baseUrl, medicalHistory);
    } else {
      return this.http.put(this.baseUrl + "/" + medicalHistory.id, medicalHistory);
    }

  }

  GetAllMedicalHistory(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  GetMedicalHistoryById(ID: any): Observable<any> {
    return this.http.get(this.baseUrl + "/" + ID);
  }

  DeleteMedicalHistoryById(ID: any): Observable<any> {
    return this.http.delete(this.baseUrl + "/" + ID)
  }
}
