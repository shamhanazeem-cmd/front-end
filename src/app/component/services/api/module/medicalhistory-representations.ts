import { StatusRepresentation } from "./status-representation";

export interface MedicalHistoryRepresentation {
    id?:number,
    allergies?:string,
    pastSurgeries?:string,
    chronicConditions?:string,
    medicalHistory?:string,
    createdBy?:string,
    createdDate?:Date,
    modifyBy?:string,
    modifyDate?:Date,
    status?:StatusRepresentation,
}