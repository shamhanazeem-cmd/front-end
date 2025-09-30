import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private baseUrl : string= 'http://localhost:8010/api/v1/status'; 

  constructor(
    private http:HttpClient
  ) { }

  GetAllStatus():Observable<any>{
    return this.http.get(this.baseUrl);
  }
}
