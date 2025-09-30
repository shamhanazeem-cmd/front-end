import { StatusRepresentation } from "./status-representation";

export interface StudentRepresentation {
    id?:string,
    studentCode?:string,
    studentName?:string,
    studentAge?:string,
    studentNic?:string,
    status?:StatusRepresentation,
}
