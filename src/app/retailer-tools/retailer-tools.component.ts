import { Component, OnInit,ElementRef,Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';

@Component({
  selector: 'app-retailer-tools',
  templateUrl: './retailer-tools.component.html',
  styleUrls: ['./retailer-tools.component.scss']
})
export class RetailerToolsComponent implements OnInit {

  constructor(
    private eleRef:ElementRef,
    private renderer:Renderer2,
    private dataService:DalalidataService
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.addingProducts()
    this.rTCAPMDHClosing()
    this.rTCAPMDBNewProduct()
    this.addingCategories()
  }
  addingProducts():void{
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".addingProducts"),"click",()=>{
      this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".rTCAddingProductControl"),"nosite")
      this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".retailerToolsControls"),"nosite")
    })
  }
  rTCAPMDHClosing():void{
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".rTCAPMDHClosing"),"click",()=>{
      this.renderer.addClass(this.eleRef.nativeElement.querySelector(".retailerToolsControls"),"nosite")
      this.renderer.addClass(this.eleRef.nativeElement.querySelector(".rTCAddingProductControl"),"nosite")
    })
  }
  rTCAPMDBNewProduct(){
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".rTCAPMDBNewProduct"),"click",()=>{
      this.dataService.uploadType="newProduct"
      this.dataService.sectionToOpen="product"
      this.eleRef.nativeElement.querySelector(".addingProductLink").click()
    })
  }
  addingCategories():void{
    let addingCategories:any=this.eleRef.nativeElement.querySelector(".addingCategories")
    this.renderer.listen(addingCategories,"click",()=>{
      this.dataService.sectionToOpen="Categories"
      this.dataService.uploadType="newProduct"
      this.eleRef.nativeElement.querySelector(".addingProductLink").click()
    })
  }
  customerOrdersLink():void{
    this.eleRef.nativeElement.querySelector(".customerOrdersLink").click()
  }
}
