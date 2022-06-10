import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';
import { BackendcommunicatorService } from '../backendcommunicator.service';
import { DalalidataService } from '../dalalidata.service';
import { Router } from '@angular/router';
import { DalaliWebSocketsService } from '../dalali-web-sockets.service';
import { DalaliSessionStorageService } from '../dalali-session-storage.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  private userOTP: string="";
  private userContact: string="";

  constructor(
    private eleRef:ElementRef,
    private dataService:DalalidataService,
    private backendCommunicator:BackendcommunicatorService,
    private dalaliRouter:Router,
    private renderer:Renderer2,
    private dWebSockets:DalaliWebSocketsService,
    private sessionDetails: DalaliSessionStorageService
    ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit():void{
    const deviceTypeDetails: Array< any >=this.getDeviceType();
    const webDeviceId: string = deviceTypeDetails[0]+' '+deviceTypeDetails[1]+' '+this.fnBrowserDetect()+' '+this.browserName();
    this.sessionDetails.webDeviceId= webDeviceId;    
    this.checkDetails();
  }

  getDeviceType(): any{
    const ua = navigator.userAgent;
    const browserDetails: any ={

    }
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return ["tablet", ua];
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return ["mobile",ua];
    }
    return ["desktop",ua];
  };
  fnBrowserDetect(): string{
                  
    let userAgent = navigator.userAgent;
    let browserName: any = null;
    
    if(userAgent.match(/chrome|chromium|crios/i)){
        browserName = "chrome";
      }else if(userAgent.match(/firefox|fxios/i)){
        browserName = "firefox";
      }  else if(userAgent.match(/safari/i)){
        browserName = "safari";
      }else if(userAgent.match(/opr\//i)){
        browserName = "opera";
      } else if(userAgent.match(/edg/i)){
        browserName = "edge";
      }else{
        browserName="No browser detection";
      }
      return browserName         
  }

  browserName (): any {
        return (
          function (agent) {        
              switch (true) {
                case agent.indexOf("edge") > -1: return "MS Edge";
                case agent.indexOf("edg/") > -1: return "Edge ( chromium based)";
                case agent.indexOf("opr") > -1 && !!window.opr: return "Opera";
                case agent.indexOf("chrome") > -1 && !!window.chrome: return "Chrome";
                case agent.indexOf("trident") > -1: return "MS IE";
                case agent.indexOf("firefox") > -1: return "Mozilla Firefox";
                case agent.indexOf("safari") > -1: return "Safari";
                default: return "other";
              }
          }
        )(
          window.navigator.userAgent.toLowerCase()
          );
  }
  
  checkDetails(){
    let otpDetails:any=localStorage.getItem("userOTPItems") 
    if(otpDetails!=null){   
      this.sessionDetails.oTPPresent=true; 
      this.sessionDetails.addDeviceQuiz=false
      this.otpSignIn()
    }else{
      this.sessionDetails.oTPPresent=false;
      this.sessionDetails.addDeviceQuiz= true
      // const noOTPRF:FormData =  new FormData();
      // noOTPRF.append('webDeviceID',this.sessionDetails.webDeviceId)
      // this.sessionDetails.redFlag(noOTPRF).then((resp: any) => {
      //   this.sessionDetails.addDeviceQuiz= resp;
      //   this.dalaliRouter.navigateByUrl('home');
      // }).catch((err: any) => {
      //   console.error(err)
      // })
      this.dalaliRouter.navigateByUrl('home');
    }
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
      this.backendCommunicator.backendCommunicator(formToAppend,"post",`${this.backendCommunicator.backendBaseLink}/otpSignIn`).then((resp : any)=>{
        if(resp[0]=="success"){
          this.dataService.setUserBasicInfo([resp[1],resp[2],resp[3],resp[4]])
          this.userOTP=resp[5]
          this.userContact=resp[6]
          let userOTPItems:Array<string>=[this.userContact,this.userOTP]
          localStorage.setItem("userOTPItems",JSON.stringify(userOTPItems))
          this.dWebSockets.wsBackEndCommunicator(
            this.dataService.userData.userContact,
            this.dataService.userData.userName,
            this.dataService.userData.userType,
          )
        }
        this.dalaliRouter.navigateByUrl('home')
      }).catch ((err: any) => {
        const innerLoaerDivElement: HTMLElement = this.eleRef.nativeElement.querySelector('.innerLoaerDiv');
        this.renderer.addClass(innerLoaerDivElement,'nosite')
        const noInternetErrorElement: HTMLElement = this.eleRef.nativeElement.querySelector('.noInternetError');
        this.renderer.removeClass(noInternetErrorElement,'nosite')
      });
    }else{
      this.dalaliRouter.navigateByUrl('home')
    }
  }
}
