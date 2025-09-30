import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../services/api/user/user-auth.service';
import { UserService } from '../services/api/user/user.service';
import { LoginRepresentation } from '../services/api/module/login-representation';

@Component({
  selector: 'app-institute-login',
  templateUrl: './institute-login.component.html',
  styleUrls: ['./institute-login.component.scss'],
})
export class InstituteLoginComponent {
  loginObj: LoginRepresentation = {}
  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private router: Router
  ) { }
  ngOnInit(): void { }

  login(): void {
    console.log('Login object:', this.loginObj);

    this.userService.login(this.loginObj).subscribe(
      (response: any) => {
        console.log('Full response:', response);
        console.log('JWT Token:', response.jwtToken);
        console.log('User data:', response.user);

        if (response.jwtToken) {
          this.userAuthService.setToken(response.jwtToken);

          if (response.user && response.user.role) {
            this.userAuthService.setRole(response.user.role);
            const role = response.user.role[0]?.roleName;
            console.log('User role:', role);

            if (role === "admin") {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          } else {
            console.warn('No user role found in response');
            this.router.navigate(['/dashboard']);
          }
        } else {
          console.error('No JWT token received');
        }
      },
      (error) => {
        console.log('Error status:', error.status);
        console.log('Error message:', error.message);
        console.log('Error details:', error.error);

        // Handle specific error cases
        if (error.status === 401) {
          alert('Login failed: Invalid credentials');
        } else if (error.status === 0) {
          alert('Network error: Cannot connect to server');
        } else {
          alert('Login failed: ' + error.message);
        }
      }
    );
  }
}
