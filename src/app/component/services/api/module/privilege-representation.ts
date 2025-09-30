import { ModuleRepresentation } from "./module-representation";
import { RoleRepresentation } from "./role-representation";

export interface PrivilegeRepresentation {
    id?:string,
    roleId?:RoleRepresentation,
    moduleId?:ModuleRepresentation,
    sel?:string,
    ins?:string,
    upd?:string,
    del?:string
}
