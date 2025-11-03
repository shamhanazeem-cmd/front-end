import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private baseUrl : string= 'http://localhost:8010/api/v1/patient'; 

  constructor(
    private http:HttpClient
  ) { }

  createPatient(patient:any,type:any):Observable<any>{
      if(type=='Add'){
        return this.http.post(this.baseUrl,patient);
      }else{
        return this.http.put(this.baseUrl+"/"+patient.id,patient);
    }
  }

  
  getAllPatients(page: number = 0, size: number = 10): Observable<any> {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
  
      return this.http.get<any>(this.baseUrl, { params });
    }


  GetAllPatient():Observable<any>{
    return this.http.get(this.baseUrl);
  }

  getPatientsById(ID:any):Observable<any>{
    return this.http.get(this.baseUrl+"/"+ID);
  }

  deletePatientById(ID:any):Observable<any>{
    return this.http.delete(this.baseUrl+"/"+ID)
  }

}