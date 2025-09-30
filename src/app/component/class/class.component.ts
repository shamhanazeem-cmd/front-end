import { Component } from '@angular/core';
import { StudentService } from '../services/api/student/student.service';
import { CourseService } from '../services/api/course/course.service';
import { FormBuilder } from '@angular/forms';
import { ClassRepresentation } from '../services/api/module/class-representation';
import swal from 'sweetalert';
import { ClassService } from '../services/api/student_course/class.service';
@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent {

  classObj:ClassRepresentation = {};

  type:any;
  classId:any;
  allCourses:any;
  courseValue:any;
  allStudents:any;
  courseId:string;
  studentValue:any;
  isEditClass:Boolean = false;
  classes: Array<any> = [];
  allCourse: Array<any> = [];

  constructor(
    private studentService:StudentService,
    private courseService:CourseService,
    private classService:ClassService,
    public fb:FormBuilder
  ){}

  ngOnInit(): void {
    this.isEditClass == false;
    this.GetAllStudents();
    this.GetAllCourse();
}

GetAllStudents(){
this.studentService.GetAllStudents().subscribe(allData=>{
  this.allStudents = allData.data.dataList;
})
}

GetAllCourse(){
  this.courseService.GetAllCourses().subscribe(allData=>{
    this.allCourses = allData.data.dataList;
  })
}

onChangeStudent(ID:any){
  this.classObj.studentName = ID.target.value;
  console.log(this.classObj.studentName);
}

onChangeCourse(ID:any){
  this.classObj.courseName = ID.target.value;
  console.log(this.classObj.courseName);
}

SaveClass():void{
  this.type = this.isEditClass==false?'Add':'Update';
  if(this.type=='Add'){
    console.log(this.classObj);
    swal({
      title: "Are you sure?",
      text: "That you want to Add this details?",
      icon: "warning",
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        this.classService.createClass(this.classObj,this.type)
        .subscribe({
          next:(result):void=>{
            this.GetAllStudents();  
          }
        });
        swal("Sucessfull!", "Class has been Adedd!", "success");
      }
     
    });
  }else{
    console.log(this.classObj);
    
    this.classService.createClass(this.classObj,this.type)
        .subscribe({
          next:(result):void=>{
            this.GetAllStudents();  
          }
        });
    swal("Sucessfull!", "Class has been updated!", "success");


  }
}

GetClassById(studentID:any){

  this.classService.GetClassIdByCourseAndStudent(studentID,this.courseId).subscribe(allData=>{
    this.classId=allData.data.dataList[0].id;

      this.classService.GetClassById(this.classId).subscribe(allData=>{ 
      this.classObj = allData.data.dataList[0];
      this.isEditClass = true;
      this.studentValue = allData.data.dataList[0].studentId.studentName;
      this.classObj.studentName = allData.data.dataList[0].studentId.studentName;
  
      this.courseValue = allData.data.dataList[0].courseId.courseName;
      this.classObj.courseName = allData.data.dataList[0].courseId.courseName;
      
    })

  })
    
}

DeleteById(studentID:any){
  
  this.classService.GetClassIdByCourseAndStudent(studentID,this.courseId).subscribe(allData=>{
    this.classId=allData.data.dataList[0].id;
    console.log(typeof(this.classId));

    swal({
      title: "Are you sure? To Delete",
      icon: "warning",
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        this.classService.DeleteClassById(this.classId)
        .subscribe({
          next:(allData):void=>{
          }
        });
        swal("Sucessfull!", "Student has been Deleted!", "success");
      }
     
    });
    
  })
}

onChangeCourseName(ID:any){
  this.courseId = ID.target.value;
  this.classService.GetStudentForClass(ID.target.value).subscribe(allData=>{
    this.classes = allData.data.dataList;
  })
}
}
