import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customers-orders',
  templateUrl: './customers-orders.component.html',
  styleUrls: ['./customers-orders.component.scss']
})
export class CustomersOrdersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  printWindow():void{
    window.print()
  }
}
