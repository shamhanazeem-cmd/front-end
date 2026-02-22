import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {

  private baseUrl: string = 'http://localhost:8010/api/v1/medicalhistory';
  
  constructor(
    private http: HttpClient
  ) { }

  // Helper method to get headers with token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // or sessionStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createMedicalHistory(medicalHistory: any, type: any): Observable<any> {
    const headers = this.getHeaders();
    
    if (type == 'Add') {
      return this.http.post(this.baseUrl, medicalHistory, { headers });
    } else {
      return this.http.put(this.baseUrl + "/" + medicalHistory.id, medicalHistory, { headers });
    }
  }

  getAllMedicalHistories(page: number = 0, size: number = 10): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.baseUrl, { params, headers });
  }

  GetAllMedicalHistory(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.baseUrl, { headers });
  }

  GetMedicalHistoryById(ID: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.baseUrl + "/" + ID, { headers });
  }

  DeleteMedicalHistoryById(ID: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(this.baseUrl + "/" + ID, { headers });
  }
}