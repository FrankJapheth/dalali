import { Component, OnInit } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-sold',
  templateUrl: './products-sold.component.html',
  styleUrls: ['./products-sold.component.scss']
})
export class ProductsSoldComponent implements OnInit {

  constructor(
    private dataService:DalalidataService,
    private dRoutes:Router
  ) { }

  ngOnInit(): void {
  }

  dayRecordView():void{
    let dateToday: Date =new Date()

    let todayFullYear: any = dateToday.getFullYear()
    let todayMonth: any = dateToday.getMonth()+1
    let todayDay: any =dateToday.getDay()

    let todaysDate: string = todayFullYear + "/" + todayMonth + "/" + todayDay
    this.dataService.daysDate=todaysDate
    this.dRoutes.navigateByUrl("daysProductSold")
    
  }
  viewOtherDays():void{
    this.dataService.calenderTypeMode="prodSold"
    this.dRoutes.navigateByUrl("dalaliCalender")
  }

}
