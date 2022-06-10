import { Injectable } from '@angular/core';
import { BackendcommunicatorService } from './backendcommunicator.service';

@Injectable({
  providedIn: 'root'
})
export class DalaliSessionStorageService {
  public sessionLogIn: boolean= false;
  public oTPPresent: boolean=false;
  public webDeviceId: string='';
  public addDeviceQuiz: any= null;
  constructor(
    private backComm: BackendcommunicatorService
  ) { }

  redFlag(msgBody: FormData): Promise<any>{
    return new Promise((rFResp: any, rFRej: any ) => {
      this.backComm.backendCommunicator(msgBody,'POST',`${this.backComm.backendBaseLink}/noOTPRF`).then((noOTPRFResp: any)=>{
        rFResp(noOTPRFResp);
      }).catch((err: any) => {
        rFRej(err)
      })
    })
  }
}
