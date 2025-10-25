import { HttpClient } from '@angular/common/http';
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

  GetAllPatient():Observable<any>{
    return this.http.get(this.baseUrl);
  }

  GetPatientsById(ID:any):Observable<any>{
    return this.http.get(this.baseUrl+"/"+ID);
  }

  DeletePatientById(ID:any):Observable<any>{
    return this.http.delete(this.baseUrl+"/"+ID)
  }

}