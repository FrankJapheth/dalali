import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';
import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';
import { Router } from '@angular/router';

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
              private backendCommunicator:BackendcommunicatorService,
              private dalaliRouter: Router
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
            userContactType="Phone number"
        }else if(userContact.match(mailformat)){
            userContactType="Email"
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
      signUpFormData.append('contactType',this.contactType)
      this.contactType=this.contactChecker((<HTMLInputElement>document.getElementById("userContact")).value)
      if(this.contactType!="undetermined"){
        if(this.emptyValues.length==0){
          if(this.checkSignUpPassword()){
            this.renderer.removeClass(loaderDiv,'nosite');
            this.backendCommunicator.backendCommunicator(signUpFormData,'post',`${this.backendCommunicator.backendBaseLink}/signUp`).then((resp:any)=>{
              this.renderer.addClass(loaderDiv,'nosite');

              if (resp.status == 0){

                this.signUpAlert("Welcome to dalali")

                const userResp:boolean=window.confirm("Do you want to add this account to this device?")
                if (userResp === true){
                  console.log(resp.userContact,resp.userPassword);
                }
                

              }else if (resp.status == 1){

                this.signUpAlert("Welcome back to dalali")

                const userResp:boolean=window.confirm("Do you want to add this account to this device?")

                if (userResp == true){
                  console.log(resp.userContact,resp.userPassword);
                }
                

              }else if (resp.status == 2){
                this.signUpAlert("This account exists in our system use a different contact")
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
