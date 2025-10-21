import { Component } from '@angular/core';
import { StatusService } from '../services/api/status/status.service';
import { FormBuilder } from '@angular/forms';
import swal from 'sweetalert';
import { MedicalhistoyService } from '../services/api/medicalhistory/medicalhistoy.service';
import { MedicalHistoryRepresentation } from '../services/api/module/medicalhistory-representations';

@Component({
  selector: 'app-medicalhistory',
  templateUrl: './medicalhistory.component.html',
  styleUrls: ['./medicalhistory.component.scss']
})
export class MedicalhistoryComponent {

  medicalHistoryObj: MedicalHistoryRepresentation = {};
  MedicalHistories: Array<any> = [];
  allStatus: any;

  type: string;
  statusValue: any;
  isEditMedicalHistory: boolean = false;
  dtDynamicVerticalScrollExample: any;

  constructor(
    private medicalHistoryService: MedicalhistoyService,
    private statusService: StatusService,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEditMedicalHistory == false;
    this.GetAllStatus();
    this.GetAllMedicalHistory();
  }

  SaveMedicalHistory(): void {
    this.type = this.isEditMedicalHistory == false ? 'Add' : 'Update';
    if (this.type == 'Add') {
      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
        .then(willDelete => {
          if (willDelete) {
            this.medicalHistoryService.createMedicalHistory(this.medicalHistoryObj, this.type)
              .subscribe({
                next: (result): void => {
                  this.GetAllMedicalHistory();
                }
              });
            swal("Sucessfull!", "Medical History has been Adedd!", "success");
          }
        });
    } else {
      console.log(this.medicalHistoryObj);
      this.medicalHistoryService.createMedicalHistory(this.medicalHistoryObj, this.type)
        .subscribe({
          next: (result): void => {
            this.GetAllMedicalHistory();
          }
        });
      swal("Sucessfull!", "Medical History has been updated!", "success");
    }
  }

GetMedicalHistoryById(ID: any) {
  this.medicalHistoryService.GetMedicalHistoryById(ID).subscribe(allData => {
    this.medicalHistoryObj = allData.data.dataList[0];

    // Convert string to Date object
    if (this.medicalHistoryObj.createdDate) {
      this.medicalHistoryObj.createdDate = new Date(this.medicalHistoryObj.createdDate);
    }

    this.isEditMedicalHistory = true;

    if (allData.data.dataList[0].status) {
      this.medicalHistoryObj.status = allData.data.dataList[0].status.id;
    }

    console.log("all Data", allData);
  });
}



  GetAllMedicalHistory() {
    this.medicalHistoryService.GetAllMedicalHistory().subscribe(allData => {
      console.log(allData);

      this.MedicalHistories = allData.data.dataList;
      this.medicalHistoryObj.status = allData.data.dataList[0].status.id;
    })
  }

  DeleteById(ID: any) {
    swal({
      title: "Are you sure",
      text: "That you want to Delete this Medical History?",
      icon: "warning",
      dangerMode: true,
    })
      .then(willDelete => {
        if (willDelete) {
          swal("Deleted!", "Order has been deleted!", "success");
          this.medicalHistoryService.DeleteMedicalHistoryById(ID).subscribe(allData => {
            this.GetAllMedicalHistory();
          })
        }
      });

  }

  GetAllStatus() {
    this.statusService.GetAllStatus().subscribe(allData => {
      this.allStatus = allData.data.dataList;

    })
  }

  onChangeStatus(E: any) {
    this.medicalHistoryObj.status = E.target.value;

  }

}
