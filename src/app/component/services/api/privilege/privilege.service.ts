import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService {

  private baseUrl: string = 'http://localhost:8010/api/v1/privilege';
  privilegeObj: any;
  constructor(
    private http: HttpClient
  ) { }


  GetPrivilegeById(ID: any): Observable<any> {
    return this.http.get(this.baseUrl + "/" + "getPrivilege" + "/" + ID);
  }

  GetAllPrivilegeForComponent(roleName: string, moduleId: string): Observable<any> {
    return this.http.get(this.baseUrl + "/" + "getPrivilegeForComponent" + "/" + roleName + "/" + moduleId);
  }

  GetAllPrivilege(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // In your Angular service - send the object directly, not wrapped in array
  createPrivilege(privilege: any, type: any): Observable<any> {
    console.log('Creating/Updating privilege:', privilege, 'Type:', type);

    if (type === 'Add') {
      return this.http.post(this.baseUrl, privilege);
    } else {
      // Handle case when privilege might be inside an array
      if (Array.isArray(privilege)) {
        this.privilegeObj = privilege[0];
      }

      const requestData = {
        id: this.privilegeObj.id,
        roleId: privilege.roleId,
        moduleId: this.privilegeObj.moduleId.id,
        sel: privilege.sel,
        ins: privilege.ins,
        upd: privilege.upd,
        del: privilege.del
      };

      console.log('Transformed data:', requestData);
      console.log('Privilege ID for update:', this.privilegeObj.id);

      return this.http.put(`${this.baseUrl}/${this.privilegeObj.id}`, requestData);
    }
  }

}
