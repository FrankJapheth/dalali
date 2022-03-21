import { Component, OnInit } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';

@Component({
  selector: 'app-products-categories',
  templateUrl: './products-categories.component.html',
  styleUrls: ['./products-categories.component.scss']
})
export class ProductsCategoriesComponent implements OnInit {

  constructor(
    private dalaliData:DalalidataService
  ) { }
  public prodCats:any=[]
  
  ngOnInit(): void {
    this.getProductCat()
  }
  getProductCat():void{
    this.dalaliData.getProductCategories().then(resp=>{
      this.prodCats=resp  
    })
  }

}
