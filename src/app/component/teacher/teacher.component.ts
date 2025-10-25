import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../services/api/course/course.service';
import { TeacherService } from '../services/api/teacher/teacher.service'; // You'll need to create this

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
  editingTeacherId: string | null = null;
  isLoadingCourses: boolean = false;
  isLoadingTeachers: boolean = false;

  // Pagination properties
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  constructor(
    private formBuilder: FormBuilder, 
    private courseService: CourseService,
    private teacherService: TeacherService // Inject teacher service
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.loadCourses();
    this.loadQualifications();
    this.loadTeachers(); // Load teachers with pagination
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
        this.allCourse = [];
        this.isLoadingCourses = false;
      }
    });
  }

  loadQualifications() {
    // Replace with your actual service call
    // Mock data for demonstration
    this.allQualification = [
      { id: '1', qualificationName: 'Bachelor' },
      { id: '2', qualificationName: 'Master' },
      { id: '3', qualificationName: 'PhD' },
      { id: '4', qualificationName: 'Diploma' }
    ];
  }

  // Load teachers with pagination
  loadTeachers(page: number = this.currentPage, size: number = this.pageSize) {
    this.isLoadingTeachers = true;
    this.teacherService.getAllTeachers(page, size).subscribe({
      next: (response) => {
        console.log('Teachers response:', response);
        this.teachers = response.data.dataList;
        
        // Update pagination info
        this.currentPage = response.data.pageNumber;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.hasNext = response.data.hasNext;
        this.hasPrevious = response.data.hasPrevious;
        
        this.isLoadingTeachers = false;
      },
      error: (error) => {
        console.error('Error loading teachers:', error);
        this.isLoadingTeachers = false;
      }
    });
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadTeachers(page, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadTeachers(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadTeachers(this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0; // Reset to first page when page size changes
    this.loadTeachers(this.currentPage, this.pageSize);
  }

  SaveTeacher() {
    if (this.teacherForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.teacherForm.value;
    console.log('Form Data:', formData);

    if (this.isEditTeacher && this.editingTeacherId) {
      // Update existing teacher
      this.teacherService.createTeacher(formData, this.editingTeacherId).subscribe({
        next: (response) => {
          console.log('Teacher updated:', response);
          this.loadTeachers(); // Reload current page
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating teacher:', error);
        }
      });
    } else {
      // Create new teacher
      // this.teacherService.createTeacher(formData).subscribe({
      //   next: (response) => {
      //     console.log('Teacher created:', response);
      //     this.loadTeachers(0, this.pageSize); // Go to first page to see new teacher
      //     this.resetForm();
      //   },
      //   error: (error) => {
      //     console.error('Error creating teacher:', error);
      //   }
      // });
    }
  }

  GetTeacherById(id: string) {
    this.teacherService.GetTeacherById(id).subscribe({
      next: (teacher) => {
        // Populate form with teacher data for editing
        this.teacherForm.patchValue({
          teacherCode: teacher.data.teacherCode,
          teacherName: teacher.data.teacherName,
          course: teacher.data.course?.courseCode,
          qualification: teacher.data.qualification?.id
        });
        this.isEditTeacher = true;
        this.editingTeacherId = id;
      },
      error: (error) => {
        console.error('Error loading teacher:', error);
      }
    });
  }

  DeleteById(id: string) {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teacherService.DeleteTeacherById(id).subscribe({
        next: (response) => {
          console.log('Teacher deleted:', response);
          this.loadTeachers(this.currentPage, this.pageSize); // Reload current page
        },
        error: (error) => {
          console.error('Error deleting teacher:', error);
        }
      });
    }
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