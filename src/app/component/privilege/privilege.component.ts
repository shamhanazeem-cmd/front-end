import { Component } from '@angular/core';
import { PrivilegeService } from '../services/api/privilege/privilege.service';
import { ModuleService } from '../services/api/mod_component/module.service';
import { FormBuilder } from '@angular/forms';
import { RoleService } from '../services/api/role/role.service';
import { PrivilegeRepresentation } from '../services/api/module/privilege-representation';
import swal from 'sweetalert';

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.scss']
})
export class PrivilegeComponent {

  selectToggle:any;
  addToggle:any;
  deleToggle:any;
  updateToggle:any;
  isEnabled:boolean;

  type:any;
  allRoles:any;
  roleValue:any;
  allModules:any;
  privileges:any;
  moduleValue:any;
  getprivileges:any;
  isEditRole:boolean=true;
  isEditModule:boolean=true;
  isEditPrivilege:boolean=true;
  privilegeObj:PrivilegeRepresentation = {};

  constructor(
    public fb:FormBuilder,
    private roleService:RoleService,
    private moduleService:ModuleService,
    private privilageService:PrivilegeService,
  ){}

  ngOnInit(): void {
    this.GetAllRole();
    this.getAllPrivilege();
    this.isEditRole=false;
    this.isEditModule=false;
    this.isEditPrivilege=false;

}

onChangeRole(E:any){
  this.GetAllFilteredModule(E.target.value);
  this.privilegeObj.roleId=E.target.value;
}

onChangeModule(E:any){
  this.privilegeObj.moduleId=E.target.value;
  
}

GetAllRole(){
    this.roleService.GetAllRole().subscribe(allData=>{
      this.allRoles = allData.data.dataList;
    })
  }

GetAllFilteredModule(ID:string){
    this.moduleService.GetFilteredModule(ID).subscribe(allData=>{
      this.allModules = allData.data.dataList;
      console.log(this.allModules);
      
    })
  }

getAllPrivilege(){
    this.privilageService.GetAllPrivilege().subscribe(allData=>{
      this.privileges = allData.data.dataList;
    })
  }

onChangeSelect(E:any){
    this.selectToggle=document.getElementById('selectId') as HTMLInputElement;
    if(this.selectToggle.checked == true){
      this.privilegeObj.sel = "1";
    }else{
      this.privilegeObj.sel = "0";
    }
}

onChangeAdd(E:any){
  this.addToggle=document.getElementById('addID') as HTMLInputElement;
  
  if(this.addToggle.checked == true){
    this.privilegeObj.ins = "1";
  }else{
    this.privilegeObj.ins = "0";
  }
}

onChangeUpdate(E:any){
  this.updateToggle=document.getElementById('updateId') as HTMLInputElement;
  
  if(this.updateToggle.checked == true){
    this.privilegeObj.upd = "1";
  }else{
    this.privilegeObj.upd = "0";
  }
}

onChangeDelete(E:any){
  this.deleToggle=document.getElementById('deleteId') as HTMLInputElement;
  
  if(this.deleToggle.checked == true){
    this.privilegeObj.del = "1";
  }else{
    this.privilegeObj.del = "0";
  }
}


GetPrivilegeById(ID:any){

  this.isEditPrivilege = true;

  this.addToggle=document.getElementById('addID') as HTMLInputElement;
  this.deleToggle=document.getElementById('deleteId') as HTMLInputElement;
  this.selectToggle=document.getElementById('selectId') as HTMLInputElement;
  this.updateToggle=document.getElementById('updateId') as HTMLInputElement;
  
  this.addToggle.checked=false;
  this.deleToggle.checked=false;
  this.updateToggle.checked=false;
  this.selectToggle.checked=false;

  this.privilegeObj.sel = "0";
  this.privilegeObj.ins = "0";
  this.privilegeObj.upd = "0";
  this.privilegeObj.del = "0";
  
  this.privilageService.GetPrivilegeById(ID).subscribe(allData=>{
    console.log(ID);
    
    this.getprivileges=allData.data.dataList;
    this.privilegeObj=allData.data.dataList;
    
    console.log(this.privilegeObj);

    if(this.getprivileges[0].del=="1"){
      this.deleToggle.checked=true;
      this.privilegeObj.del = "1";
    }
    
    if(this.getprivileges[0].ins=="1"){
      this.addToggle.checked=true;
      this.privilegeObj.ins = "1";
    }
    
    if(this.getprivileges[0].sel=="1"){
      this.selectToggle.checked=true;
      this.privilegeObj.sel = "1";
    }
  
    if(this.getprivileges[0].upd=="1"){
      this.updateToggle.checked=true;
      this.privilegeObj.upd = "1";
    }

    this.isEditModule=true;
    this.isEditRole=true;
    this.moduleValue=allData.data.dataList[0].moduleId.moduleName;
    this.privilegeObj.moduleId=this.moduleValue;
    this.roleValue=allData.data.dataList[0].roleId.roleName;
    this.privilegeObj.roleId=this.roleValue;


    this.isEnabled=true;

  })
}


DeleteById(E:any){}

SavePrivilege(){
    
    this.type = this.isEditPrivilege==false?'Add':'Update';
    if(this.type=='Add'){
      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.privilageService.createPrivilege(this.privilegeObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.getAllPrivilege(); 
              console.log(result);
               
            }
          });
          swal("Sucessfull!", "Student has been Adedd!", "success");
        }
       
      });
    }else{
      
      this.privilageService.createPrivilege(this.privilegeObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.getAllPrivilege();  
            }
          });
      swal("Sucessfull!", "Privilage has been updated!", "success");

  
    }
  }
}
