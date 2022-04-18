import { Component, ElementRef, OnInit } from '@angular/core';
import { BackendcommunicatorService } from '../backendcommunicator.service';
import { DalalidataService } from '../dalalidata.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(
    private eleRef:ElementRef,
    private dataService:DalalidataService,
    private backendCommunicator:BackendcommunicatorService,
    ) { }
    private userOTP: string="";
    private userContact: string="";

  ngOnInit(): void {
  }
  ngAfterViewInit():void{
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
          this.dataService.setUserBasicInfo([resp[1],resp[2],resp[3],resp[4]])
          this.userOTP=resp[5]
          this.userContact=resp[6]
          let userOTPItems:Array<string>=[this.userContact,this.userOTP]
          localStorage.setItem("userOTPItems",JSON.stringify(userOTPItems))
        }
        this.eleRef.nativeElement.querySelector(".homeLinkSignIn").click()
      })
    }else{
      this.eleRef.nativeElement.querySelector(".homeLinkSignIn").click()      
    }
  }
}
