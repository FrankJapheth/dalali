import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { BackendcommunicatorService } from '../backendcommunicator.service';
import { DalalidataService } from '../dalalidata.service';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnInit {
  private emptyValues:Array<any>=[]
  private userType:string=""
  private regResponse:string=""
  private contactType:string=""
  private userContact:string=""
  private userOTP:string=""
  public displayText:string="Display text"

  constructor(
    private elRef:ElementRef, 
    private renderer:Renderer2,
    private dalaliData:DalalidataService,
    private backendCommunicator:BackendcommunicatorService
              
  ) { }

  ngOnInit(): void {
  }

  eppendData(formToAppend:FormData,inputList:NodeList):FormData{
    formToAppend=new FormData();
    formToAppend.append("userDOB",this.dalaliData.getUserDOB())
    inputList.forEach((inputNode:any)=>{
      
      if(inputNode.value!=""){
        formToAppend.append(inputNode.id,inputNode.value)
      }else{        
        this.emptyValues.push(inputNode)
      }
    })    
    return formToAppend
  }
  contactChecker(userContact:string){
    const phoneexpression:RegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    const mailformat:RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let userContactType:string=""
        if(userContact.match(phoneexpression)){
            userContactType="phone"
        }else if(userContact.match(mailformat)){
            userContactType="email"
        }else{
          userContactType="undetermined"
        }
    return userContactType
  }

  signInFunc():NodeList{
    let SignUpInputs:NodeList=document.querySelectorAll(".signInInput");
    return SignUpInputs
  }
  clearData(inputs:any):void{

    inputs.forEach((inputElement: any) => {
      inputElement.value=''
    });

  }
  signInButton(evt:any): void{
    if(evt.type==='click'){
      const loaderDiv: HTMLElement = this.elRef.nativeElement.querySelector(".loaderDiv");
      this.emptyValues=[]
      let signInData:FormData= new FormData
      let signInFormData:FormData=this.eppendData(signInData,this.signInFunc());
      this.contactType=this.contactChecker((<HTMLInputElement>document.getElementById("SignInContact")).value)
      if(this.contactType!="undetermined"){
        if(this.emptyValues.length==0){
          this.renderer.removeClass(loaderDiv,'nosite');
            this.backendCommunicator.backendCommunicator(signInFormData,'post',`${this.backendCommunicator.backendBaseLink}/signIn`).then((resp: any)=>{
              this.renderer.addClass(loaderDiv,'nosite');
              if(resp === null){
                this.signInRouter('You are not registered',true).then(()=>{
                  this.closeFeedbackLoop()
                })  
              }else{
                this.userOTP=resp[2]
                this.userContact=resp[1]
                this.regResponse=resp[0]
                let userOTPItems:Array<string>=[this.userContact,this.userOTP]
                localStorage.setItem("userOTPItems",JSON.stringify(userOTPItems))
                this.clearData(this.signInFunc())
                if( resp.length > 1){
                  this.signInRouter('Logged in successfully',true).then(()=>{
                    this.closeFeedbackLoop()
                    this.elRef.nativeElement.querySelector(".homeBut").click()
                  })
                }else{
                  this.signInRouter('Log in Failed please check your details and try again',true).then(()=>{
                    this.closeFeedbackLoop()
                  })                
                }
             }
            })
          }else{
            this.signInRouter("There are some empty values",false).then(()=>{
              this.closeFeedbackLoop()
              this.elRef.nativeElement.querySelector(".homeBut").click()
            })
          }
      }else{
        this.signInRouter("We only allow phone number or email",false).then(()=>{
          this.closeFeedbackLoop()
          this.elRef.nativeElement.querySelector(".homeBut").click()
        })
      }
    }
  }

  signInAlert(message: string){
    this.openFeedBackLoop(message)
  }

  signInRouter(msg: string,signInType: boolean): Promise< any >{
    return new Promise( (signInResp: any) =>{
      this.signInAlert(msg)
      const usrBut: any = this.elRef.nativeElement.querySelector(".sWFLFCloseAns")
      this.renderer.listen(usrBut,'click',()=>{
        if(signInType === true){
          signInResp(true)
        }else{
          signInResp(false)
        }
      })
    })
  }

  closeFeedbackLoop():void{
    let fBLoop:any=this.elRef.nativeElement.querySelector(".sWFLMain")
    this.renderer.addClass(fBLoop,"nosite")
  }

  openFeedBackLoop(textToDisplay:string):void{
    this.displayText=textToDisplay
    let fBLoop:any=this.elRef.nativeElement.querySelector(".sWFLMain")
    this.renderer.removeClass(fBLoop,"nosite")
  }
  
}
