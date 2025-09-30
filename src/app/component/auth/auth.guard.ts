import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserAuthService } from "../services/api/user/user-auth.service";
import { UserService } from "../services/api/user/user.service";


@Injectable({
  providedIn:'root'
})

export class AuthGuard implements CanActivate{

  constructor(
    private userAuthservice:UserAuthService,
    private router: Router,
    private userService:UserService
    
    ){}
 
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
      
      if(this.userAuthservice.getToken()!== null){
        const role = route.data["roles"] as Array<String>;
        console.log(role);
        
        if(role){
          const match = this.userService.roleEqual(role);

          if(match){
            return true;
          }else{
            this.router.navigate(['/forbidden']);
            return false;
          }
        }
      }
      this.router.navigate(['/login']);
      return false;
      }
};
