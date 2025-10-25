import { Component } from '@angular/core';
import { PatientRepresentation } from '../services/api/module/patient-representation';
import { PatientService } from '../services/api/patient/patient.service';
import { StatusService } from '../services/api/status/status.service';
import { FormBuilder } from '@angular/forms';
import swal from 'sweetalert';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent {

    patientObj: PatientRepresentation = {};
    patients: Array<any> = [];
    allStatus: any;
    people$: Observable<any[]>;
  
    type: string;
    statusValue: any;
    isEditPatient: boolean = false;
    dtDynamicVerticalScrollExample: any;
  
    constructor(
      private patientService: PatientService,
      private statusService: StatusService,
      public fb: FormBuilder
    ) { }
  
    ngOnInit(): void {
      this.isEditPatient== false;
      this.GetAllStatus();
      this.GetAllPatient();

}

GetAllPatient(){

}

SavePatient():void{

    this.type = this.isEditPatient==false?'Add':'Update';
    if(this.type=='Add'){
      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.patientService.createPatient(this.patientObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllPatient(); 
            }
          });
          swal("Sucessfull!", "Patient has been Adedd!", "success");
        }
       
      });
    }else{
      console.log(this.patientObj);
      
      this.patientService.createPatient(this.patientObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllPatient();  
            }
          });
      swal("Sucessfull!", "Patient has been updated!", "success");

  
    }

    
}

GetPatientsById(ID:any){
  this.patientService.GetPatientsById(ID).subscribe(allData=>{ 
  this.patientObj = allData.data.dataList[0];

  this.isEditPatient = true;
  this.statusValue=allData.data.dataList[0].status.name;
  this.patientObj.status = allData.data.dataList[0].status.id;
  
})
}

GetAllPatients(){
  this.patientService.GetAllPatient().subscribe(allData=>{
    this.patients = allData.data.dataList; 
    this.patientObj.status = allData.data.dataList[0].status.id;
  })
}

DeleteById(ID:any){

    swal({
      title: "Are you sure",
      text: "That you want to Delete this Student?",
      icon: "warning",
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        swal("Deleted!", "Order has been deleted!", "success");
        this.patientService.DeletePatientById(ID).subscribe(allData=>{
          this.GetAllPatient();
        })
      }
    });

}

GetAllStatus(){
  this.statusService.GetAllStatus().subscribe(allData=>{
    this.allStatus = allData.data.dataList; 
    
  })
}

onChangeStatus(E:any){
  this.patientObj.status = E.target.value;
  
}

}
