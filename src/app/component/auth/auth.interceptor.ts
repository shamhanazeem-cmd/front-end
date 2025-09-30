import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, throwError } from "rxjs";
import { UserAuthService } from "../services/api/user/user-auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(
        private userAuthservice:UserAuthService,
        private router: Router
        
        ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if(req.headers.get("No-Auth") == 'True'){
            return next.handle(req.clone());
        }

        const token = this.userAuthservice.getToken();
        req = this.addToken(req,token);
        console.log(req);
        
        return next.handle(req).pipe(
            catchError(
                (err : HttpErrorResponse) =>{
                    console.log(err.status);

                    if(err.status===401){
                        this.router.navigate(['/login'])
                    }else if(err.status===403){
                        this.router.navigate(['/forbidden'])
                    }

                    return throwError("Something went wrong..!");
                    
                }
            )
        );
    }

    private addToken(request: HttpRequest<any>, token:string){
        return request.clone(
            {
                setHeaders:{
                    Authorization : `Bearer ${token}`
                }
            }
        );
    }
}