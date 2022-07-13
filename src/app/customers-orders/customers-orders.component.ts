import { AfterViewInit, Component, OnInit, ElementRef,Renderer2 } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';

@Component({
  selector: 'app-customers-orders',
  templateUrl: './customers-orders.component.html',
  styleUrls: ['./customers-orders.component.scss']
})
export class CustomersOrdersComponent implements OnInit,AfterViewInit {

  public docCartIds: any=[];
  public docCustomerCartIds: any=[];
  public cartDetails: any={};
  public userName: string ='';
  public productsDetailsArray: any=[];
  public productsDetails: any={};
  public windowWidth: number = window.innerWidth;
  public section: string = 'user';

  constructor(
    private eleRef: ElementRef,
    private dataServices: DalalidataService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }
}

