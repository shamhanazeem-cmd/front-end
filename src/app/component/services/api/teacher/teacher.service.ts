import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private baseUrl: string = 'http://localhost:8010/api/v1/teacher';

  constructor(
    private http: HttpClient
  ) { }


  createTeacher(teacher: any, type: any): Observable<any> {
    if (type == 'Add') {
      return this.http.post(this.baseUrl, teacher);
    } else {
      console.log(teacher);

      return this.http.put(this.baseUrl + "/" + teacher.id, teacher);
    }

  }

  getAllTeachers(page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.baseUrl, { params });
  }
  GetAllTeachers(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  GetTeacherById(ID: any): Observable<any> {
    return this.http.get(this.baseUrl + "/" + ID);
  }

  DeleteTeacherById(ID: any): Observable<any> {
    return this.http.delete(this.baseUrl + "/" + ID)
  }

}
