import { Component, ElementRef, OnInit } from '@angular/core';
import { BackendcommunicatorService } from '../backendcommunicator.service';
import { DalalidataService } from '../dalalidata.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  private userOTP: string="";
  private userContact: string="";

  constructor(
    private dalaliData:DalalidataService,
    private backendCommunicator:BackendcommunicatorService,
    private elRef:ElementRef,) { }

  ngOnInit(): void {
    this.otpSignIn()     
  }
  otpSignIn(){
    let userOTPDetails:any=localStorage.getItem("userOTPItems")
    if (userOTPDetails!=null){
      let parsedUserOTPDetails:any= JSON.parse(userOTPDetails)
      let userContact:string=parsedUserOTPDetails[0]
      let userOTP:string=parsedUserOTPDetails[1]
      let formToAppend:FormData=new FormData();
      formToAppend.append("userContact",userContact)
      formToAppend.append("userOTP",userOTP)
      this.backendCommunicator.backendCommunicator(formToAppend,"post",`${this.backendCommunicator.backendBaseLink}/otpSignIn`).then(resp=>{
        if(resp[0]=="success"){
          this.dalaliData.setUserDOB(resp[4])
          this.dalaliData.setUserBasicInfo([resp[1],resp[2],resp[3]])
          this.userOTP=resp[5]
          this.userContact=resp[6]
          let userOTPItems:Array<string>=[this.userContact,this.userOTP]
          localStorage.setItem("userOTPItems",JSON.stringify(userOTPItems))
        }
        this.elRef.nativeElement.querySelector(".homeLink").click()
      })
    }
  }

}
