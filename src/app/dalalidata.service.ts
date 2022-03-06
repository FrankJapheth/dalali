import { Injectable} from '@angular/core';
import { BackendcommunicatorService } from './backendcommunicator.service';

@Injectable({
  providedIn: 'root'
})
export class DalalidataService {

  constructor(
    private backendCommunicator:BackendcommunicatorService,
  ) { }

  public userData:any={}
  private userDOB:string="not set"
  public typeOfSelectedUserSearch:string=""
  public selectedUsers:Array<string>=[]
  public selectedLinks:Array<string>=[]
  public typeOfRepair:string=""
  public systemRepairTypes:Array<string>=["updating","errorCorrection"]
  public uploadType:string=""

  setUserBasicInfo(userBasicInfo:Array<string>){
    
    this.userData["basicInfo"]=userBasicInfo

  }
  getUserBasiInfo(){
    return this.userData["basicInfo"]
  }
  setUserDOB(userDob:string){
    this.userDOB=userDob
    this.userData["userDOB"]=this.userDOB
  }
  getUserDOB():string{
    return this.userDOB
  }
  getUsers(userDetails:FormData){
    return new Promise((respResolve,respReject)=>{
      this.backendCommunicator.backendCommunicator(userDetails,"post",
      `${this.backendCommunicator.backendBaseLink}/getUsers`).then(resp=>{
        respResolve(resp)
      }).catch(err=>{
        respReject(err)
      })
    })
  }
  getRoutedLinks(){
    return new Promise((backResp,backRej)=>{
      this.backendCommunicator.backendCommunicator(new FormData,"get",
      `${this.backendCommunicator.backendBaseLink}/getRedirects`).then(resp=>{
        backResp(resp)
      }).catch(err=>{
        backRej(err)
      })
    })
  }

}
