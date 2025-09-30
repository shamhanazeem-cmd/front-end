import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  
  private baseUrl : string= 'http://localhost:8010/api/v1/role'; 

  constructor(
    private http:HttpClient
  ) { }

  GetAllRole():Observable<any>{
    return this.http.get(this.baseUrl);
  }
}
