import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { DalalidataService } from '../service/data/dalalidata.service';

@Component({
  selector: 'app-user-oders',
  templateUrl: './user-oders.component.html',
  styleUrls: ['./user-oders.component.scss']
})
export class UserOdersComponent implements OnInit, AfterViewInit {

  public userOrders:Array<any>=[]

  constructor(

    private dataService:DalalidataService,
    private dRouter:Router

  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.getCompleteOrderes()
      
  }

  getCompleteOrderes():void{

    this.userOrders=[]

    this.dataService.getOrders(this.dataService.userData.userContact,true).then((resp:any)=>{

      this.userOrders=resp

    })

  }

  getIncompleteOrders():void{
    this.userOrders=[]

    setTimeout(() => {
    this.dataService.getOrders(this.dataService.userData.userContact,false).then((resp:any)=>{

      this.userOrders=resp

    })
      
    }, 50);

  }

  viewOrder(evt:any):void{

    const orderId:string=evt.target.id.slice(2)

    this.dataService.orderViewOrderId = orderId
    
    this.dRouter.navigateByUrl('orderDetails')

  }



}
