import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';
import { DalalidataService } from '../service/data/dalalidata.service';
import { DalaliWebSocketsService } from '../service/webSocket/dalali-web-sockets.service';

import { SingleWayFeedbackLoopComponent } from '../single-way-feedback-loop/single-way-feedback-loop.component';
import { MultiWaysFeedbackLoopComponent } from '../multi-ways-feedback-loop/multi-ways-feedback-loop.component';


@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnInit {
  @ViewChild(SingleWayFeedbackLoopComponent) singleLoop!:SingleWayFeedbackLoopComponent;
  @ViewChild(MultiWaysFeedbackLoopComponent) multiLoop!: MultiWaysFeedbackLoopComponent;

  
  private emptyValues:Array<any>=[]
  private userType:string=""
  private contactType:string=""
  public displayText:string="Display text"

  constructor(
    private elRef:ElementRef, 
    private renderer:Renderer2,
    private dalaliData:DalalidataService,
    private backendCommunicator:BackendcommunicatorService,
    private dalaliRouter:Router,
    private dWebsockets:DalaliWebSocketsService
              
  ) { }

  ngOnInit(): void {
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
      let signInData:FormData= new FormData()
      let signInFormData:FormData=this.eppendData(signInData,this.signInFunc());
      this.contactType=this.contactChecker((<HTMLInputElement>document.getElementById("SignInContact")).value)
      if(this.contactType!="undetermined"){
        if(this.emptyValues.length==0){
          this.renderer.removeClass(loaderDiv,'nosite');
            this.backendCommunicator.backendCommunicator(signInFormData,'post',`${this.backendCommunicator.backendBaseLink}/signIn`).then((resp: any)=>{
              this.renderer.addClass(loaderDiv,'nosite');
              
              if (resp.status === 0){
                this.userType='buyer'
                this.dalaliData.userData.userType='buyer'

                this.dalaliData.multiwayfLoopMsg=' This account contact does not exist in our system. Do you want to sign up ?'
                this.multiLoop.openFeedbackLoop().then((userResp:Boolean)=>{

                  if ( userResp === true ){

                    this.dalaliRouter.navigateByUrl('signUp')

                  }else{

                    this.dalaliRouter.navigateByUrl('home')

                  }

                })

              }else if (resp.status === 1){
                
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
          
                const userDetails:any = {
                  "userContact":resp.userContact,
                  "userName":resp.userName,
                  "userDob":resp.userDob,
                  "userType":this.userType
                }
      
                this.dalaliData.setUserBasicInfo(userDetails)

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

                        localStorage.setItem('currentAccount',JSON.stringify(userAccount))

                        this.singleLoop.openFeedbackLoop().then(()=>{

                          this.cartComfirms().then(()=>{

                            this.dalaliRouter.navigateByUrl('home')

                          }).catch((err:any)=>{

                            console.error(err);
                            
                          })

                        })

                      }else{

                        this.cartComfirms().then(()=>{

                          this.dalaliRouter.navigateByUrl('home')

                        }).catch((err:any)=>{

                          console.error(err);
                          
                        })

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

                          localStorage.setItem('currentAccount',JSON.stringify(userAccount))
                
                          this.dalaliData.singlewayfLoopMsg=`Account Added`
  
                          this.singleLoop.openFeedbackLoop().then(()=>{

                            this.cartComfirms().then(()=>{
  
                              this.dalaliRouter.navigateByUrl('home')
  
                            }).catch((err:any)=>{
  
                              console.error(err);
                              
                            })

                          })

                        }else{

                          this.cartComfirms().then(()=>{

                            this.dalaliRouter.navigateByUrl('home')

                          }).catch((err:any)=>{

                            console.error(err);
                            
                          })
                        }

                      })

                    }else{

                      this.cartComfirms().then(()=>{

                        this.dalaliRouter.navigateByUrl('home')

                      }).catch((err:any)=>{

                        console.error(err);
                        
                      })

                    }

                  }

                })

              }else if (resp.status === 2){

                this.dalaliData.singlewayfLoopMsg="You have used a wrong password please check then try again."
                this.singleLoop.openFeedbackLoop()

              }

            })
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
  openedEye():void{
    const openEyeDiv: any = this.elRef.nativeElement.querySelector('.openEye')
    this.renderer.addClass(openEyeDiv,'nosite')
    const closedEyeDiv: any = this.elRef.nativeElement.querySelector('.closedEye')
    this.renderer.removeClass(closedEyeDiv,'nosite')
    const signInPasswordInput: any = this.elRef.nativeElement.querySelector('#signInPassword')
    signInPasswordInput.type='password'
  }

  closedEye():void{
    const closedEyeDiv: any = this.elRef.nativeElement.querySelector('.closedEye')
    this.renderer.addClass(closedEyeDiv,'nosite')
    const openEyeDiv: any = this.elRef.nativeElement.querySelector('.openEye')
    this.renderer.removeClass(openEyeDiv,'nosite')
    const signInPasswordInput: any = this.elRef.nativeElement.querySelector('#signInPassword')
    signInPasswordInput.type='text'
  }

  cartComfirms():Promise<boolean>{

    return new Promise<boolean>((resolve, reject) => {
          
      const cartsStoreIndices:any = {
        cartDate:'cartDate',
        cartTime:'cartTime',
        cartAccount:'cartAccount',
        cartState:'cartState',
        cartOrderId:'cartOrderId',
        cartSaleId:'cartSaleId',
        cartType:'cartType',
        complete:'complete',
        retailer:'retailer'
      }
          
      this.dalaliData.getCartDbStore('userCarts','id',cartsStoreIndices).then((cartStore:any)=>{
  
        this.dalaliData.getPendingCart(cartStore[0]).then((currentCart:any)=>{
  
          if (currentCart != undefined){
  
            this.dalaliData.multiwayfLoopMsg=`You have a pending cart. Do you want to use it or start a new one.`
      
            this.multiLoop.openFeedbackLoop("Current", "New").then((ans:boolean)=>{
              
              if (ans == false){
  
                this.dalaliData.getDbCartProds(currentCart.id).then(()=>{
                  
                  this.dalaliData.currentCartId=currentCart.id
                  
                  resolve(true)
  
                })
  
              }else{
                this.dalaliData.multiwayfLoopMsg=`Creating a new cart will delete the current one with the ordered products. Do you want to continue ?`
      
                this.multiLoop.openFeedbackLoop().then((sAns:boolean)=>{
  
                  if ( sAns == false){
  
  
                    this.dalaliData.getDbCartProds(currentCart.id).then(()=>{
                      
                      this.dalaliData.currentCartId=currentCart.id

                      resolve(true)
  
                    })
                  }else{
  
                    this.dalaliData.deleteCart(currentCart.id).then((resp:boolean)=>{
  
                      this.dalaliData.singlewayfLoopMsg=" Deleted the cart successfuly"
  
                      this.singleLoop.openFeedbackLoop().then(()=>{
                        
                        resolve(true)
  
                      })
  
                    }).catch((err:any)=>{
  
                      reject(err);
  
                    })
  
                  }
  
                })
              }
  
            })
  
          }else{

            resolve(true)
  
          }
          
  
        }).catch((err:any)=>{

          reject(err)

        })
  
      }).catch((err:any)=>{
        reject(err)
      })
      
    })

  }
  
}
