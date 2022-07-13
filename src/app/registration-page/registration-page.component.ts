import { AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';
import { DalalidataService } from '../service/data/dalalidata.service';
import { DalaliWebSocketsService } from '../service/webSocket/dalali-web-sockets.service';

import { SingleWayFeedbackLoopComponent } from '../single-way-feedback-loop/single-way-feedback-loop.component';
import { MultiWaysFeedbackLoopComponent } from '../multi-ways-feedback-loop/multi-ways-feedback-loop.component';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit, AfterViewInit {
  @ViewChild(SingleWayFeedbackLoopComponent) singleLoop!:SingleWayFeedbackLoopComponent;
  @ViewChild(MultiWaysFeedbackLoopComponent) multiLoop!: MultiWaysFeedbackLoopComponent;

  private emptyValues:Array<any>=[]
  private userType:string=""
  private regResponse:string=""
  private contactType:string=""
  private userContact:string=""
  private userOTP:string=""
  public displayText:string="Display text"

  constructor(private elRef:ElementRef, 
              private renderer:Renderer2,
              private dalaliData:DalalidataService,
              private backendCommunicator:BackendcommunicatorService,
              private dalaliRouter: Router,
              private dWebsockets:DalaliWebSocketsService
              ) {  }

  ngOnInit(): void {     
  }

  ngAfterViewInit(): void {
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
    formToAppend.append("userDOB",this.dalaliData.getUserBasiInfo().userDob)
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

                this.userType='buyer'
                this.dalaliData.userData.userType='buyer'

                if (!this.dWebsockets.websocketOpen){
                
                  this.dWebsockets.wsBackEndCommunicator(
        
                    resp.userContact,
                    resp.userName,
                    this.userType,
        
                  )
                }

                this.dalaliData.singlewayfLoopMsg=`Welcome ${resp.userName}`

                this.singleLoop.openFeedbackLoop().then(()=>{

                  let userAccounts:any = localStorage.getItem('userAccounts')
                  let accountPresent:boolean=false

                  if (userAccounts === null){

                    this.dalaliData.multiwayfLoopMsg="Do you want to add this account to this device"
                    this.multiLoop.openFeedbackLoop().then((userResp:Boolean)=>{
                      
                      if (userResp === true){

                        const userAccount:any={
                          contact:resp.userContact,
                          password:resp.userPassword
                        }

                        userAccounts=[userAccount]

                        localStorage.setItem('userAccounts',JSON.stringify(userAccounts))

                        localStorage.setItem('currentAccount',JSON.stringify(userAccount))

                        this.dalaliData.singlewayfLoopMsg=`Account Added`

                        this.singleLoop.openFeedbackLoop().then(()=>{

                          this.dalaliRouter.navigateByUrl('home')

                        })

                      }else{

                        this.dalaliRouter.navigateByUrl('home')
                      
                      }
                    })

                  }else{

                    if ( accountPresent === false ) {

                      this.dalaliData.multiwayfLoopMsg="Do you want to add this account to this device"
                      this.multiLoop.openFeedbackLoop().then((userResp:Boolean)=>{
                      
                        if (userResp === true){

                          const userAccount:any={
                            contact:resp.userContact,
                            password:resp.userPassword
                          }
    
                          userAccounts.push(userAccount)
    
                          localStorage.setItem('userAccounts',JSON.stringify(userAccounts))

                          localStorage.setItem('currentAccount',JSON.stringify(userAccount))
                          
                          this.dalaliData.singlewayfLoopMsg=`Account Added`
  
                          this.singleLoop.openFeedbackLoop().then(()=>{

                            this.dalaliRouter.navigateByUrl('home')

                          })

                        }else{

                          this.dalaliRouter.navigateByUrl('home')

                        }

                      })

                    }else{

                      this.dalaliRouter.navigateByUrl('home')

                    }

                  }
                })

              }else if (resp.status == 1){
                
                if(resp.userGroups.includes('superUser')){
      
                  this.dalaliData.userData.userType='superuser'
                 this.userType='superuser'
      
                }else if (resp.userGroups.includes('admins')){
      
                  this.dalaliData.userData.userType='admin'
                  this.userType='admin'
      
                }else if (resp.userGroups.includes('retailers')){
      
                  this.dalaliData.userData.userType='retailer'
                  this.userType='retailer'
      
                }else if(resp.userGroups.includes('wholesalers')) {
      
                  this.dalaliData.userData.userType='wholesaler'
                  this.userType='wholesaler'
      
                }else{
      
                  this.dalaliData.userData.userType='buyer'
                  this.userType='buyer'
      
                }

                if (!this.dWebsockets.websocketOpen){
                
                  this.dWebsockets.wsBackEndCommunicator(
        
                    resp.userContact,
                    resp.userName,
                    this.userType,
        
                  )
                }
                
                
                this.dalaliData.singlewayfLoopMsg=`Welcome back ${resp.userName}`

                this.singleLoop.openFeedbackLoop().then(()=>{

                  let userAccounts:any = localStorage.getItem('userAccounts')
                  let accountPresent:boolean=false

                  if (userAccounts === null){

                    this.dalaliData.multiwayfLoopMsg="Do you want to add this account to this device"
                    this.multiLoop.openFeedbackLoop().then((userResp:Boolean)=>{
                      
                      if (userResp === true){

                        const userAccount:any={
                          contact:resp.userContact,
                          password:resp.userPassword
                        }

                        userAccounts=[userAccount]

                        localStorage.setItem('userAccounts',JSON.stringify(userAccounts))
                
                        this.dalaliData.singlewayfLoopMsg=`Account Added`

                        this.singleLoop.openFeedbackLoop().then(()=>{

                          this.dalaliRouter.navigateByUrl('home')

                        })

                      }else{

                        this.dalaliRouter.navigateByUrl('home')

                      }
                    })

                  }else{

                    userAccounts = JSON.parse(userAccounts)

                    for (const userAccount of userAccounts) {
                      
                      if (userAccount.contact === resp.userContact){
                        accountPresent = true
                      }

                    }

                    if ( accountPresent === false ) {

                      this.dalaliData.multiwayfLoopMsg="Do you want to add this account to this device"
                      this.multiLoop.openFeedbackLoop().then((userResp:Boolean)=>{
                      
                        if (userResp === true){

                          const userAccount:any={
                            contact:resp.userContact,
                            password:resp.userPassword
                          }
                          
                          userAccounts.push(userAccount)
    
                          localStorage.setItem('userAccounts',JSON.stringify(userAccounts))
                
                          this.dalaliData.singlewayfLoopMsg=`Account Added`
  
                          this.singleLoop.openFeedbackLoop().then(()=>{

                            this.dalaliRouter.navigateByUrl('home')

                          })

                        }else{

                          this.dalaliRouter.navigateByUrl('home')
                        }

                      })

                    }else{

                      this.dalaliRouter.navigateByUrl('home')

                    }

                  }

                })

              }else if (resp.status == 2){
                this.dalaliData.singlewayfLoopMsg="This account exists in our system use a different contact"
                this.singleLoop.openFeedbackLoop()
              }

            })
          }else{
            this.dalaliData.singlewayfLoopMsg="Wrong password match"
            this.singleLoop.openFeedbackLoop()
          }
        }else{
          this.dalaliData.singlewayfLoopMsg="There are some empty values"
          this.singleLoop.openFeedbackLoop()
        }
      }else{
        this.dalaliData.singlewayfLoopMsg="We only allow phone number or email"
        this.singleLoop.openFeedbackLoop()
      }
    }
    
  }

}
