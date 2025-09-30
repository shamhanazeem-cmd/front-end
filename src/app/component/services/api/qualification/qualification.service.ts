import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QualificationService {

  private baseUrl : string= 'http://localhost:8010/api/v1/qualification'; 

  constructor(
    private http:HttpClient
  ) { }

  GetAllQualification():Observable<any>{
    return this.http.get(this.baseUrl);
  }
}
