import { Component, OnInit,ElementRef } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';
import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';

@Component({
  selector: 'app-products-categories',
  templateUrl: './products-categories.component.html',
  styleUrls: ['./products-categories.component.scss']
})
export class ProductsCategoriesComponent implements OnInit {
  public prodCats:any=[]

  constructor(
    private dalaliData:DalalidataService,
    private backComms: BackendcommunicatorService,
    private eleRef: ElementRef
  ) { }
  public bEBaseLink: string = this.backComms.backendBaseLink
  
  ngOnInit(): void {
    this.getProductCat()
  }
  getProductCat():void{
    this.dalaliData.getProductCategories().then(resp=>{
      this.prodCats=resp  
    })
  }
  catTitleSeeMore(evt:any):void{
    let docCatTitleSeeMoreId:any=evt.target.id
    let cDTCTNID=`#cDTCTN${docCatTitleSeeMoreId.slice(4)}`
    let cDTCTNEle=this.eleRef.nativeElement.querySelector(cDTCTNID)
    this.dalaliData.chosenCategory=cDTCTNEle.innerText
    this.dalaliData.chosenCategoryId=docCatTitleSeeMoreId.slice(4)
    let pCTSMID=`#pCTSM${docCatTitleSeeMoreId.slice(4)}`
    let pCTSMEle=this.eleRef.nativeElement.querySelector(pCTSMID)
    pCTSMEle.click()
  }

}
