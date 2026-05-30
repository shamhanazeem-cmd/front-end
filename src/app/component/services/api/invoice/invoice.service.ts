import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

    private baseUrl: string = 'http://localhost:8010/api/v1/invoice';


  constructor(
            private http: HttpClient
    
  ) { }

       createInvoice(invoice: any, type: any): Observable<any> {
         if (type == 'Add') {
           return this.http.post(this.baseUrl, invoice);
         } else {
           return this.http.put(this.baseUrl + "/" + invoice.id, invoice);
         }
     
       }
     
       getAllInvoices(page: number = 0, size: number = 10): Observable<any> {
           let params = new HttpParams()
             .set('page', page.toString())
             .set('size', size.toString());
       
           return this.http.get<any>(this.baseUrl, { params });
         }
         
     
       GetAllInvoice(): Observable<any> {
         return this.http.get(this.baseUrl);
       }
     
       getInvoiceById(ID: any): Observable<any> {
         return this.http.get(this.baseUrl + "/" + ID);
       }
     
       deleteInvoiceById(ID: any): Observable<any> {
         return this.http.delete(this.baseUrl + "/" + ID)
       }
  
  
}
