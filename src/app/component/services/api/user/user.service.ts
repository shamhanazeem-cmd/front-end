import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  BASE_URL = "http://localhost:8010";

  requestHeader = new HttpHeaders(
    {"No-Auth":"True"}
  );
  constructor(private httpClient:HttpClient,
              private userAuthService:UserAuthService
  ) {}

  public login(loginData:any): Observable<any> {
    return this.httpClient.post(this.BASE_URL+"/authenticate",loginData,{headers:this.requestHeader});
  }

  //@ts-ignore
  public roleEqual(allowRoles):boolean{
    
    let isMatch = false;
    const userRoles:any = this.userAuthService.getRoles();
    console.log(userRoles);
    
    if(userRoles!=null && userRoles){
      for(let i=0; i<userRoles.length; i++){
          for(let j=0; j<allowRoles.length; j++){
            if(userRoles[i].roleName===allowRoles[j]){
              isMatch = true;
              return isMatch;
            }else{
              isMatch = false;
              
            }
          }
          return isMatch;
      }
    }
  }
}
