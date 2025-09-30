import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { UserAuthService } from './component/services/api/user/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'institute-web';

  isViewRole:any;
  roleName:any;

  constructor(
    private router:Router,
    private userAuthService:UserAuthService
  ){}

  ngOnInit(){
    this.displayLoginUsername();
    }

    displayLoginUsername(){

      this.isViewRole =  this.userAuthService.getRoles();

      if(this.isViewRole!=null){
      for(let i = 0 ; i<this.isViewRole.length; i++){
        this.roleName = this.isViewRole[i].roleName;
        }
      }
    }

    public logIn(){
      this.router.navigate(['/login']);
    }

    public isLoggedIn(){
      return this.userAuthService.isLoggedIn();
    }
  
    public logOut(){
      this.router.navigate(['/login']);
      return this.userAuthService.clear();
     
    }

    
}
