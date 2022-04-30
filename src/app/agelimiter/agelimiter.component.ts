import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';

@Component({
  selector: 'app-agelimiter',
  templateUrl: './agelimiter.component.html',
  styleUrls: ['./agelimiter.component.scss']
})
export class AgelimiterComponent implements OnInit {

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

  constructor( private elRef:ElementRef, private renderer:Renderer2,private dalaliData:DalalidataService) { }

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
      this.elRef.nativeElement.querySelector(".homeBut").click()
    }else{
      let textToDisplay:string="You are underage."
      this.openFeedBackLoop(textToDisplay)      
    }
  }
  submitterButton(){
    this.renderer.listen(this.elRef.nativeElement.querySelector(".submitterButton"),'click',()=>{
      this.storeDateAndClose()
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
