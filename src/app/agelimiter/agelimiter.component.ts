import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { DalalidataService } from '../service/data/dalalidata.service';
import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';
import { DalaliWebSocketsService } from '../service/webSocket/dalali-web-sockets.service';
import { SingleWayFeedbackLoopComponent } from '../single-way-feedback-loop/single-way-feedback-loop.component';
import { MultiWaysFeedbackLoopComponent } from '../multi-ways-feedback-loop/multi-ways-feedback-loop.component';

@Component({
  selector: 'app-agelimiter',
  templateUrl: './agelimiter.component.html',
  styleUrls: ['./agelimiter.component.scss']
})
export class AgelimiterComponent implements OnInit {
  
  @ViewChild(SingleWayFeedbackLoopComponent) singleLoop!:SingleWayFeedbackLoopComponent;
  
  @ViewChild(MultiWaysFeedbackLoopComponent) multiLoop!:MultiWaysFeedbackLoopComponent;

  private yearsUpperMover:any = null
  private yearsLowerMover:any=null
  private MonthsUpperMover:any=null
  private MonthslowerMover:any=null
  public yearValue:number=2022
  public prevMonthValue:number=0
  public currentMonthValue:number=1
  public nextMonthValue:number=2
  public dayValue:number=20
  public monthsList:Array< string>=["January","February","Match","April","May"
  ,"June","July","August","September","October","November","December"]
  public daysList : Array< number >=[]
  private lastMonthDate:any=null
  public prevDayValue:number=0
  public currentDayValue:number=1
  public nextDayValue:number=2
  private DaysUpperMover:any=null
  private DayslowerMover:any=null
  public displayText:string="Display text"

  constructor( 
    private elRef:ElementRef, 
    private renderer:Renderer2,
    public dalaliData:DalalidataService,
    private backendCommunicator:BackendcommunicatorService,
    private dWebsockets:DalaliWebSocketsService,
    private dRouter:Router
    ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.addingYears()
    this.subtractingYears()
    this.addingMonths()
    this.subtractingMonths()
    this.addingDays()
    this.subtractingDays()
    this.submitterButton()
    this.autoSignIn()
  }
  gettingDays(){
    let dateToUse:Date=new Date(this.yearValue,this.currentMonthValue)
    this.daysList=[]
      while (dateToUse.getMonth() == this.currentMonthValue) {
        this.daysList.push(dateToUse.getDate());
        dateToUse.setDate(dateToUse.getDate() + 1);
      }
      this.lastMonthDate=this.daysList[this.daysList.length-1]
  }

  addingYears(){
    this.yearsUpperMover=this.elRef.nativeElement.querySelector(".yearsUpperMover")
    this.renderer.listen(this.yearsUpperMover,'click',()=>{
      this.yearValue+=1
      this.gettingDays()
      this.dateToTextBox()
    })
  }

  subtractingYears(){
    this.yearsLowerMover=this.elRef.nativeElement.querySelector(".yearslowerMover")
    this.renderer.listen(this.yearsLowerMover,'click',()=>{
      this.yearValue-=1
      this.gettingDays()
      this.dateToTextBox()
    })
  }

  addingMonths(){
    this.MonthsUpperMover=this.elRef.nativeElement.querySelector(".MonthsUpperMover")
    this.renderer.listen(this.MonthsUpperMover,'click',()=>{
      this.prevMonthValue+=1
      this.currentMonthValue+=1
      this.nextMonthValue+=1
      if(this.prevMonthValue>11){
        this.prevMonthValue=0
      }
      if(this.currentMonthValue>11){
        this.currentMonthValue=0
      }
      if(this.nextMonthValue>11){
        this.nextMonthValue=0
      }
      this.gettingDays()
      this.dateToTextBox()
    })    
  }
  subtractingMonths(){
    this.MonthslowerMover=this.elRef.nativeElement.querySelector(".MonthslowerMover")
    this.renderer.listen(this.MonthslowerMover,'click',()=>{
      this.prevMonthValue-=1
      this.currentMonthValue-=1
      this.nextMonthValue-=1
      if(this.prevMonthValue<0){
        this.prevMonthValue=11
      }
      if(this.currentMonthValue<0){
        this.currentMonthValue=11
      }
      if(this.nextMonthValue<0){
        this.nextMonthValue=11
      }            
      this.gettingDays()
      this.dateToTextBox()
    }) 
  }
  addingDays(){
    this.DaysUpperMover=this.elRef.nativeElement.querySelector(".DaysUpperMover")
    this.renderer.listen(this.DaysUpperMover,'click',() => {
      this.prevDayValue+=1
      this.currentDayValue+=1
      this.nextDayValue+=1    
      if(this.prevDayValue>this.lastMonthDate-1){
        this.prevDayValue=0
      }
      if(this.currentDayValue>this.lastMonthDate-1){
        this.currentDayValue=0
      }
      if(this.nextDayValue>this.lastMonthDate-1){
        this.nextDayValue=0
      }
      this.dateToTextBox()
    })
  }
  subtractingDays(){
    this.DayslowerMover=this.elRef.nativeElement.querySelector(".DayslowerMover")
    this.renderer.listen(this.DayslowerMover,'click',()=>{
      this.prevDayValue-=1
      this.currentDayValue-=1
      this.nextDayValue-=1
      if(this.prevDayValue<0){
        this.prevDayValue=this.lastMonthDate-1
      }
      if(this.currentDayValue<0){
        this.currentDayValue=this.lastMonthDate-1
      }
      if(this.nextDayValue<0){
        this.nextDayValue=this.lastMonthDate-1
      }
      this.dateToTextBox()
    })
  }
  dateToTextBox(){
    this.elRef.nativeElement.querySelector("#DOBTextInputPicker").value=`${this.currentDayValue+1} / ${this.currentMonthValue+1} / ${this.yearValue}`
  }
  storeDateAndClose(){
    let userBirthDate:any=new Date(`${this.monthsList[this.currentMonthValue]} ${this.currentDayValue+1}, ${this.yearValue}`)  
    let currentDate:any=new Date()
    let userAge:any=Math.abs(currentDate-userBirthDate)
    let userAgeInYears:any=userAge/(1000*3600*24*365)
    if(userAgeInYears>18){
      this.dalaliData.userData.userDob=`${this.currentDayValue+1} / ${this.currentMonthValue+1} / ${this.yearValue}`
      this.dalaliData.ageLimiterVisibility='nosite'
      this.dRouter.navigateByUrl('home')
    }else{
      let textToDisplay:string="You are underage."

      this.dalaliData.singlewayfLoopMsg=textToDisplay

      this.singleLoop.openFeedbackLoop()
    }
  }
  submitterButton(){
    this.renderer.listen(this.elRef.nativeElement.querySelector(".submitterButton"),'click',()=>{
      this.storeDateAndClose()
    })
  }

  autoSignIn():void{
    let currentAccount:any=localStorage.getItem("currentAccount")

    if(currentAccount !== null){

      currentAccount=JSON.parse(currentAccount)
        
      const signInFormData:FormData = new FormData()

      for (const accountDetail of Object.keys(currentAccount)) {

        if(accountDetail == 'contact'){

          signInFormData.append('SignInContact',currentAccount[accountDetail])
          
        }else if (accountDetail == 'password'){

          signInFormData.append('signInPassword',currentAccount[accountDetail])
          
        }
        
      }

      this.backendCommunicator.backendCommunicator(signInFormData,'post',`${this.backendCommunicator.backendBaseLink}/signIn`).then((resp: any)=>{
        let userType:string=''
        if (resp.status === 1){
          if(resp.userGroups.includes('superUser')){

            this.dalaliData.userData.userType='superuser'
            userType='superuser'

          }else if (resp.userGroups.includes('admins')){

            this.dalaliData.userData.userType='admin'
            userType='admin'

          }else if (resp.userGroups.includes('retailers')){

            this.dalaliData.userData.userType='retailer'
            userType='retailer'

          }else if(resp.userGroups.includes('wholesalers')) {

            this.dalaliData.userData.userType='wholesaler'
            userType='wholesaler'

          }else{

            this.dalaliData.userData.userType='buyer'
            userType='buyer'

          }

          const userDetails:any = {
            "userContact":resp.userContact,
            "userName":resp.userName,
            "userDob":resp.userDob,
            "userType":userType
          }

          this.dalaliData.setUserBasicInfo(userDetails)

          if (!this.dWebsockets.websocketOpen){

          this.dWebsockets.wsBackEndCommunicator(

            userDetails.userContact,
            userDetails.userName,
            userDetails.userType,

          )

            // const cart:Cart = {}

            // for (const cartKey of Object.keys(cart)) {

            //   type ObjectKey = keyof typeof cart;

            //   const myVar = cartKey as ObjectKey;

            //   console.log(myVar);

            // }

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

                      this.dalaliData.ageLimiterVisibility='nosite'

                      this.dRouter.navigateByUrl('home')

                    })

                  }else{
                    this.dalaliData.multiwayfLoopMsg=`Creating a new cart will delete the current one with the ordered products. Do you want to continue ?`

                    this.multiLoop.openFeedbackLoop().then((sAns:boolean)=>{

                      if ( sAns == false){


                        this.dalaliData.getDbCartProds(currentCart.id).then(()=>{

                          this.dalaliData.currentCartId=currentCart.id

                          this.dalaliData.ageLimiterVisibility='nosite'

                          this.dRouter.navigateByUrl('home')

                        })
                      }else{

                        this.dalaliData.deleteCart(currentCart.id).then((resp:boolean)=>{

                          this.dalaliData.singlewayfLoopMsg=" Deleted the cart successfuly"

                          this.singleLoop.openFeedbackLoop().then(()=>{

                            this.dalaliData.ageLimiterVisibility='nosite'

                          })

                        }).catch((err:any)=>{

                          console.error(err);

                        })

                      }

                    })
                  }

                })

              }else{

                this.dalaliData.ageLimiterVisibility='nosite'

              }
              
  
            })

          })

        }

        }

      })

    }
  }
}
