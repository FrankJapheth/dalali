import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dalali-calender',
  templateUrl: './dalali-calender.component.html',
  styleUrls: ['./dalali-calender.component.scss']
})
export class DalaliCalenderComponent implements OnInit {
  public today:Date = new Date()
  public year: any = this.today.getFullYear()
  public month: any = this.today.getMonth()
  public monthsList:Array< string>=["January","February","Match","April","May"
  ,"June","July","August","September","October","November","December"]

  constructor(
    private eleRef:ElementRef,
    private renderer:Renderer2,
    private dataService:DalalidataService,
    private dRoutes:Router
  ) { }

  ngOnInit(): void {

  }
  ngAfterViewInit():void{
    this.createCalendar("calenderHolder", this.year, this.month);
  }
  getPrevYear():void{
    let yearNumber:number = Number(this.year)
    if(yearNumber!=0){
      this.year=yearNumber-1
    }else{
      this.year=this.today.getFullYear()
    }
    this.createCalendar("calenderHolder", this.year, this.month)
    this.eleRef.nativeElement.querySelector(".yearDisplay").innerText=this.year
  }
  getPrevMonth():void{
    let monthNumber:number = Number(this.month)
    if(monthNumber == 0){
      monthNumber=11
    }else {
      monthNumber-=1
    }
    this.month=monthNumber
    this.eleRef.nativeElement.querySelector(".monthDisplay").innerText=this.monthsList[this.month]
    this.createCalendar("calenderHolder", this.year, this.month)
  }
  getNextYear():void{
    let yearNumber:number = Number(this.year)
    if(yearNumber!=0){
      this.year=yearNumber+1
    }else{
      this.year=this.today.getFullYear()
    }
    this.createCalendar("calenderHolder", this.year, this.month)
    this.eleRef.nativeElement.querySelector(".yearDisplay").innerText=this.year
  }
  getNextMonth():void{
    let monthNumber:number = Number(this.month)
    if(monthNumber == 11){
      monthNumber=0
    }else {
      monthNumber+=1
    }
    this.month=monthNumber
    this.eleRef.nativeElement.querySelector(".monthDisplay").innerText=this.monthsList[this.month]
    this.createCalendar("calenderHolder", this.year, this.month)
  }

  createCalendar(elem:any, year:any, month:any): void {

    let mon:any = month; // months in JS are 0..11, not 1..12
    let d:Date = new Date(year, mon);

    let table: any = `
    <table style="border-collapse: collapse;width:100%;height:auto;">
      <tr class="calenderHeader"
      style="background-color:#121420;height:50px;width:14%;color:#fff">
        <th style="border-right:1px solid #e2e2e2f6">MON</th>
        <th style="border-right:1px solid #e2e2e2f6">TUE</th>
        <th style="border-right:1px solid #e2e2e2f6">WED</th>
        <th style="border-right:1px solid #e2e2e2f6">THUR</th>
        <th style="border-right:1px solid #e2e2e2f6">FRI</th>
        <th style="border-right:1px solid #e2e2e2f6">SAT</th>
        <th style="border-right:1px solid #e2e2e2f6">SUN</th>
      </tr>
      <tr>`;

    // spaces for the first row
    // from Monday till the first day of the month
    // * * * 1  2  3  4
    for (let i = 0; i < this.getDay(d); i++) {
      table += '<td style="height:50px;width:14%;color:#121420;"></td>';
    }

    // <td> with actual dates
    while (d.getMonth() == mon) {
      table += '<td style="border:1px solid #e2e2e2f6;height:70px;width:14%;color:#121420;text-align:center;cursor: pointer;" class="workDays">' + d.getDate() + '</td>';

      if (this.getDay(d) % 7 == 6) { // sunday, last day of week - newline
        table += '</tr><tr>';
      }

      d.setDate(d.getDate() + 1);
    }

    // add spaces after last days of month for the last row
    // 29 30 31 * * * *
    if (this.getDay(d) != 0) {
      for (let i = this.getDay(d); i < 7; i++) {
        table += '<td></td>';
      }
    }

    // close the table
    table += '</tr></table>';

    this.eleRef.nativeElement.querySelector(`.${elem}`).innerHTML = table;
    this.cellsListeners();
  }

  getDay(date: any): any { // get day number from 0 (monday) to 6 (sunday)
    let day = date.getDay();
    if (day == 0) day = 7; // make Sunday (0) the last day
    return day - 1;
  }

  cellsListeners():any{
    // el.onpointerover = over_handler;
    // el.onpointerenter = enter_handler;
    // el.onpointerdown = down_handler;
    // el.onpointermove = move_handler;
    // el.onpointerup = up_handler;
    // el.onpointercancel = cancel_handler;
    // el.onpointerout = out_handler;
    // el.onpointerleave = leave_handler;
    // el.gotpointercapture = gotcapture_handler;
    // el.lostpointercapture = lostcapture_handler;
    const workDays: any = this.eleRef.nativeElement.querySelectorAll(".workDays")
    workDays.forEach((workDay: any) => {
          this.renderer.listen(workDay,"pointerenter",()=>{
            this.renderer.setStyle(workDay,"backgroundColor","#e2e2e2f6")
            this.renderer.setStyle(workDay,"color","#121420")
          });

          this.renderer.listen(workDay,"pointerleave",()=>{
            this.renderer.setStyle(workDay,"backgroundColor","#fff")
            this.renderer.setStyle(workDay,"color","#121420")
          });
          this.renderer.listen(workDay,"click",(evt:any)=>{
            let dateString: string = this.year+"/"+String(Number(this.month)+1)+"/"+evt.target.innerText
            
            this.dataService.daysDate=dateString
            this.dRoutes.navigateByUrl('daysChanges')
          })
    });

  }
}
