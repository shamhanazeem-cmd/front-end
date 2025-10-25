import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../services/api/course/course.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  teacherForm!: FormGroup;
  teachers: any[] = [];
  allCourse: any[] = [];
  allQualification: any[] = [];
  isEditTeacher: boolean = false;
  editingTeacherId: number | null = null;
  isLoadingCourses: boolean = false;

  constructor(private formBuilder: FormBuilder, private courseService: CourseService) { }
  // Inject the CourseService
  ngOnInit(): void {
    this.initFormGroup();
    this.loadCourses();
    this.loadQualifications();
    this.loadTeachers();
  }

  initFormGroup() {
    this.teacherForm = this.formBuilder.group({
      teacherCode: [0],
      teacherName: ['', [Validators.required]],
      course: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
    });
  }

  // Convenience getter for easy access to form controls
  get f() {
    return this.teacherForm.controls;
  }

  loadCourses() {
    this.isLoadingCourses = true;
    this.courseService.GetAllCourses().subscribe({
      next: (courses) => {
        console.log(courses);
        
        this.allCourse = courses.data.dataList;
        this.isLoadingCourses = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.allCourse = []; // or fallback data
        this.isLoadingCourses = false;
      }
    });
  }

  loadQualifications() {
    // Replace with your actual service call
    // this.qualificationService.getQualifications().subscribe(qualifications => {
    //   this.allQualification = qualifications;
    // });

    // Mock data for demonstration
  }

  loadTeachers() {
    // Replace with your actual service call to load teachers
    // this.teacherService.getTeachers().subscribe(teachers => {
    //   this.teachers = teachers;
    // });
  }

  SaveTeacher() {
    if (this.teacherForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.teacherForm.value;
    console.log('Form Data:', formData);

    // Add your save/update logic here
    if (this.isEditTeacher && this.editingTeacherId) {
      // Update existing teacher
      console.log('Updating teacher:', this.editingTeacherId);
    } else {
      // Create new teacher
      console.log('Creating new teacher');
    }
  }

  GetTeacherById(id: number) {
    console.log('Get teacher by ID:', id);
    // Add your get by ID logic here
  }

  DeleteById(id: number) {
    console.log('Delete teacher by ID:', id);
    // Add your delete logic here
  }

  resetForm() {
    this.teacherForm.reset({
      teacherCode: 0,
      teacherName: '',
      course: '',
      qualification: ''
    });
    this.isEditTeacher = false;
    this.editingTeacherId = null;
  }

  private markFormGroupTouched() {
    Object.keys(this.teacherForm.controls).forEach(key => {
      const control = this.teacherForm.get(key);
      control?.markAsTouched();
    });
  }
}