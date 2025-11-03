import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {

  private baseUrl: string = 'http://localhost:8010/api/v1/specialization';

  constructor(
    private http: HttpClient
  ) { }


  createSpecialization(specialization: any, type: any): Observable<any> {
    if (type == 'Add') {
      return this.http.post(this.baseUrl, specialization);
    } else {
      console.log(specialization);

      return this.http.put(this.baseUrl + "/" + specialization.id, specialization);
    }

  }

  getAllSpecializations(page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.baseUrl, { params });
  }
  GetAllSpecialization(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getSpecializationById(ID: any): Observable<any> {
    return this.http.get(this.baseUrl + "/" + ID);
  }

  deleteSpecializationById(ID: any): Observable<any> {
    return this.http.delete(this.baseUrl + "/" + ID)
  }

}
