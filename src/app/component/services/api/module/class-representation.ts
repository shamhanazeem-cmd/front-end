import { CourseRepresentation } from "./course-representation";
import { StudentRepresentation } from "./student-representation";

export interface ClassRepresentation {
    id?:string,
    studentName?:StudentRepresentation,
    courseName?:CourseRepresentation,
}