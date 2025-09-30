import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {


  private baseUrl : string= 'http://localhost:8010/api/v1/module'; 

  constructor(
    private http:HttpClient
  ) { }

  GetAllModule():Observable<any>{
    return this.http.get(this.baseUrl);
  }

  GetFilteredModule(ID:string):Observable<any>{
    return this.http.get(this.baseUrl+"/"+ID);
  }
}
