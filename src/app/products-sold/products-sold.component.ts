import { Component, OnInit } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';
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
    let dateToday: any =new Date().toLocaleDateString()
    dateToday=dateToday.split("/")

    let todayFullYear: any = dateToday[2]
    let todayMonth: any = dateToday[0]
    let todayDay: any =dateToday[1]

    let todaysDate: string = todayFullYear + "/" + todayMonth + "/" + todayDay
    this.dataService.daysDate=todaysDate
    this.dRoutes.navigateByUrl("daysProductSold")
    
  }
  viewOtherDays():void{
    this.dataService.calenderTypeMode="prodSold"
    this.dRoutes.navigateByUrl("dalaliCalender")
  }

}
