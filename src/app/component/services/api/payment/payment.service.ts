import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl : string= 'http://localhost:8010/api/v1/payment'; 

  constructor(
        private http:HttpClient
    
  ) { }
   createPayment(payment:any,type:any):Observable<any>{
        if(type=='Add'){
          return this.http.post(this.baseUrl,payment);
        }else{
          return this.http.put(this.baseUrl+"/"+payment.id,payment);
      }
    }
  
    
    getAllPayments(page: number = 0, size: number = 10): Observable<any> {
        let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());
    
        return this.http.get<any>(this.baseUrl, { params });
      }
  
  
    GetAllPayments():Observable<any>{
      return this.http.get(this.baseUrl);
    }
  
    getPaymentById(ID:any):Observable<any>{
      return this.http.get(this.baseUrl+"/"+ID);
    }
  
    deletePaymentById(ID:any):Observable<any>{
      return this.http.delete(this.baseUrl+"/"+ID)
    }
  
  
}
