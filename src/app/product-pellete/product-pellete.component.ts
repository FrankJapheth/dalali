import { Component, Input, OnInit,ElementRef,Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { BackendcommunicatorService } from '../backendcommunicator.service';

@Component({
  selector: 'app-product-pellete',
  templateUrl: './product-pellete.component.html',
  styleUrls: ['./product-pellete.component.scss']
})
export class ProductPelleteComponent implements OnInit {
  constructor(
  ) { }
    @Input() productDetails:any
  ngOnInit(): void { }

}
