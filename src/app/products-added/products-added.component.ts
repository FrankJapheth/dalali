import { Component, OnInit } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-added',
  templateUrl: './products-added.component.html',
  styleUrls: ['./products-added.component.scss']
})
export class ProductsAddedComponent implements OnInit {

  constructor(
    private dataService:DalalidataService,
    private dRoutes:Router
  ) { }

  ngOnInit(): void {
  }

  todaysAdditions():void{
    this.dataService.daysDate='Today'
    this.dRoutes.navigateByUrl('daysChanges')
  }
  viewOtherDays():void{
    this.dataService.calenderTypeMode=""
    this.dRoutes.navigateByUrl("dalaliCalender")
  }

}
