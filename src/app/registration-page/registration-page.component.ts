import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { BackendcommunicatorService } from '../backendcommunicator.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit {
  private emptyValues:Array<any>=[]
  private userType:string=""
  private regResponse:string=""
  private contactType:string=""
  private windowHeight:number=window.innerHeight
  private userContact:string=""
  private userOTP:string=""
  public displayText:string="Display text"

  constructor(private elRef:ElementRef, 
              private renderer:Renderer2,
              private dalaliData:DalalidataService,
              private backendCommunicator:BackendcommunicatorService
              ) {  }

  ngOnInit(): void {     
  }
  signUpAlert(message:string):void{
    this.openFeedBackLoop(message)
  }

  signUpFunc():NodeList{
    let SignUpInputs:NodeList=document.querySelectorAll(".signUpInput");
    return SignUpInputs
  }

  checkSignUpPassword():boolean{
    let password:any=(<HTMLInputElement>document.getElementById("userPassword")).value;
    let confirmPassword:any=(<HTMLInputElement>document.getElementById("confirmUserPassword")).value;
    let trigger:boolean
    if(password==confirmPassword){
      trigger=true
    }else{
      trigger=false
    }
    return trigger
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
  signUpButton(evt:any): void{
    if(evt.type==='click'){
      const loaderDiv: HTMLElement = this.elRef.nativeElement.querySelector(".loaderDiv");
      this.emptyValues=[]
      let signUpData:FormData= new FormData
      let signUpFormData:FormData=this.eppendData(signUpData,this.signUpFunc());
      this.contactType=this.contactChecker((<HTMLInputElement>document.getElementById("userContact")).value)
      if(this.contactType!="undetermined"){
        if(this.emptyValues.length==0){
          if(this.checkSignUpPassword()){
            this.renderer.removeClass(loaderDiv,'nosite');
            this.backendCommunicator.backendCommunicator(signUpFormData,'post',`${this.backendCommunicator.backendBaseLink}/signUp`).then(resp=>{
              this.renderer.addClass(loaderDiv,'nosite');
              this.userOTP=resp[2]
              this.userContact=resp[1]
              this.regResponse=resp[0]
              this.signUpAlert(resp[0])           
              let userOTPItems:Array<string>=[this.userContact,this.userOTP]
              localStorage.setItem("userOTPItems",JSON.stringify(userOTPItems))
              if (resp[0] !== 'Already registered'){
                this.elRef.nativeElement.querySelector(".homeBut").click()
              }
            })
          }else{
            this.signUpAlert("Wrong password match")
          }
        }else{
          this.signUpAlert("There are some empty values")
        }
      }else{
        this.signUpAlert("We only allow phone number or email")
      }
    }
    
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
