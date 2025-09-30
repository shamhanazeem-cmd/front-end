import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './component/student/student.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { CourseComponent } from './component/course/course.component';
import { TeacherComponent } from './component/teacher/teacher.component';
import { ClassComponent } from './component/class/class.component';
import { InstituteLoginComponent } from './component/institute-login/institute-login.component';
import { ForbiddenComponent } from './component/forbidden/forbidden.component';
import { AuthGuard } from './component/auth/auth.guard';
import { PrivilegeComponent } from './component/privilege/privilege.component';

const routes: Routes = [
  
  {path : 'dashboard',component : DashboardComponent,canActivate:[AuthGuard], data:{roles:['admin','user']}},

  {path : 'student',component : StudentComponent,canActivate:[AuthGuard], data:{roles:['admin']}},

  {path : 'course',component : CourseComponent,canActivate:[AuthGuard], data:{roles:['admin']}},

  {path : 'teacher',component : TeacherComponent,canActivate:[AuthGuard], data:{roles:['admin']}},

  {path : 'class',component : ClassComponent, canActivate:[AuthGuard], data:{roles:['admin']}},

  {path : 'login',component : InstituteLoginComponent},

  {path : 'forbidden',component : ForbiddenComponent},
  
  {path : 'privilege',component : PrivilegeComponent, canActivate:[AuthGuard], data:{roles:['admin','user']}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
