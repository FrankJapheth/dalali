import { Component, Input, OnInit,ElementRef,Renderer2 } from '@angular/core';

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
