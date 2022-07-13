import { AfterViewInit, Component, OnInit } from '@angular/core';

import { DalalidataService } from '../service/data/dalalidata.service';
import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit,AfterViewInit {


  public orderProducts:Array<any> = []

  constructor(
    private dataService:DalalidataService,
    public bckComms:BackendcommunicatorService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.getOrderPRoducts(this.dataService.orderViewOrderId)
      
  }

  getOrderPRoducts(orderId:string):void{
    this.dataService.cartProductsArray=[]
    this.dataService.getOrderDbCartProds(orderId).then((resp:any)=>{
      
      this.orderProducts=resp;
      
    })

  }

}
