import { StatusRepresentation } from "./status-representation";

export interface PatientRepresentation {
    id?: number,
    fullName?: string,
    nic?: string,
    dob?: string,
    gender?: string,
    address?: string,
    contactNo?: string,
    email?: string
    medicalHistory?:number,
    createdBy?: string,
    createdDate?: Date,
    modifyBy?: string,
    modifyDate?: Date,
    status?: StatusRepresentation,
}