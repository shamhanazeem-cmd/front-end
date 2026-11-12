import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqService {

  private baseUrl: string = 'http://localhost:8010/api/v1/rfq';

  constructor(
    private http:HttpClient
  ) { }

  createRFQ(rfq: any, type: string): Observable<any> {
    if (type === 'Add') {
      return this.http.post(this.baseUrl, rfq);
    } else {
      return this.http.put(`${this.baseUrl}/${rfq.id}`, rfq);
    }
  }

  GetAllRFQs(page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.baseUrl, { params });
  }

  getAllRFQs(page: number, size: number): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getRfqById(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  deleteRfqById(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
