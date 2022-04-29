import { Component,ElementRef, Renderer2 } from '@angular/core';
import { DalalidataService } from './dalalidata.service';
import { BackendcommunicatorService } from './backendcommunicator.service';
import { DalaliWebSocketsService } from './dalali-web-sockets.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dalali';
  private userOTP: string="";
  private userContact: string="";
  private windowWidth:any=window.innerWidth
  constructor(
    private eleRef:ElementRef,
    private dataService:DalalidataService,
    private backendCommunicator:BackendcommunicatorService,
    private dWebSockets:DalaliWebSocketsService,
    private renderer:Renderer2
  ) {}
  public displayText:string="Display Text"

  ngAfterViewInit(){
    this.getOffsetTop()
    this.checkDetails()
    
  }

  getOffsetTop():void{
    let pagesHoder:any=this.eleRef.nativeElement.querySelector(".pagesHoder")
    let pagesHoderTop:any=pagesHoder.offsetTop
    this.dataService.holderOffsetTop=pagesHoderTop   
  }
  redirect(){
    this.eleRef.nativeElement.querySelector(".homeLinkSignIn").click()    
  }
  checkDetails(){
    let otpDetails:any=localStorage.getItem("userOTPItems")
    if(otpDetails!=null){    
      this.otpSignIn()
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
      this.backendCommunicator.backendCommunicator(formToAppend,"post",`${this.backendCommunicator.backendBaseLink}/otpSignIn`).then(resp=>{
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
        this.eleRef.nativeElement.querySelector(".homeLink").click()
      })
    }else{
      this.eleRef.nativeElement.querySelector(".homeLink").click()      
    }
  }
  
  openNavBar():void{
    let docNavHolder:any=this.eleRef.nativeElement.querySelector(".linDiv")
    this.renderer.setStyle(docNavHolder,"display","flex")
    setTimeout(() => {        
      let docNavBar:any=this.eleRef.nativeElement.querySelector(".linkList")
      this.renderer.setStyle(docNavBar,"left","10%")
    }, 100);
  }
  closeNavBar():void{
    if(this.windowWidth<800){
      let docNavBar:any=this.eleRef.nativeElement.querySelector(".linkList")
      this.renderer.setStyle(docNavBar,"left","-100%")
      setTimeout(() => {    
        let docNavHolder:any=this.eleRef.nativeElement.querySelector(".linDiv")
        this.renderer.setStyle(docNavHolder,"display","none")    
      }, 330);
    }

  }
}
