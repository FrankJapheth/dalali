import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { BackendcommunicatorService } from '../backendcommunicator.service';

@Component({
  selector: 'app-home-categories',
  templateUrl: './home-categories.component.html',
  styleUrls: ['./home-categories.component.scss']
})
export class HomeCategoriesComponent implements OnInit {

  constructor(
    private eleRef:ElementRef,
    private renderer:Renderer2,
    private dataServices:DalalidataService,
    private backEndComms:BackendcommunicatorService
  ) { }
  
  public bEBaseLink=this.backEndComms.backendBaseLink

  @Input() catId:any
  @Input() catName:any
  public productCategoriesDetails:any=[]
  public catProdsArray:any=[]
  ngOnInit(): void {
  }
  ngAfterViewInit():void{
    this.dataServices.getMaxProdIndex().then((respmax:any)=>{
      this.getCategoryProducts(respmax).then((resp:any)=>{
        this.catProdsArray=resp
      }).then(()=>{      
        this.storeFetchedProdDetails()
      })
    })
  }
  getCategoryProducts(maxIndex:string):Promise<string>{  
    return new Promise((res:any,rej:any)=>{
      let catProdFormData:FormData=new FormData()
      catProdFormData.append("categoryProductId",this.catId)
      catProdFormData.append("prodMaxIndex",maxIndex)
      catProdFormData.append("cartName",this.catName)
      this.backEndComms.backendCommunicator(catProdFormData,"post",`${this.backEndComms.backendBaseLink}/getCatProds`).then(resp=>{
        res(resp)
      }) 
    })
  }
  storeFetchedProdDetails():void{
    for (let prodDet = 0; prodDet < this.catProdsArray.length; prodDet++) {
      const prodDetEle = this.catProdsArray[prodDet];
      this.dataServices.addSiteProd(prodDetEle[0],prodDetEle)     
    }
  }
  catTitleSeeMore(evt:any):void{
    let docCatTitleSeeMoreId:any=evt.target.id
    let cDTCTNID=`#cDTCTN${docCatTitleSeeMoreId.slice(4)}`
    let cDTCTNEle=this.eleRef.nativeElement.querySelector(cDTCTNID)
    this.dataServices.chosenCategory=cDTCTNEle.innerText
    this.dataServices.chosenCategoryId=docCatTitleSeeMoreId.slice(4)
    let pCTSMID=`#pCTSM${docCatTitleSeeMoreId.slice(4)}`
    let pCTSMEle=this.eleRef.nativeElement.querySelector(pCTSMID)
    pCTSMEle.click()
  }
  catTitleName(evt:any):void{
    let doccatTitleNameId:any=evt.target.id
    let cDTCTNID=`#cDTCTN${doccatTitleNameId.slice(9)}`
    let cDTCTNEle=this.eleRef.nativeElement.querySelector(cDTCTNID)
    this.dataServices.chosenCategory=cDTCTNEle.innerText
    this.dataServices.chosenCategoryId=doccatTitleNameId.slice(9)
    let pCTSMID=`#pCTSM${doccatTitleNameId.slice(9)}`
    let pCTSMEle=this.eleRef.nativeElement.querySelector(pCTSMID)
    pCTSMEle.click()
  }
  addToCartBut(evt:any):void{
    let aTCBId:string=evt.target.id.slice(4)
    let cPCAORNTBId:string=`#cPCAORNTB${aTCBId}`
    let cPCAORNTBIdValue:number=this.eleRef.nativeElement.querySelector(cPCAORNTBId).value
    this.addProdToCart(aTCBId,cPCAORNTBIdValue).then((respProdAddition:any)=>{
      let productInArray:boolean=respProdAddition[1]
      let cPCId:string=`#cPC${aTCBId}`
      let cPCEle:any=this.eleRef.nativeElement.querySelector(cPCId)
      if(productInArray==true){
        this.renderer.removeClass(cPCEle,"nosite")
        evt.target.innerText="REMOVE"
      }else{
        evt.target.innerText="ADD TO CART"
        this.renderer.addClass(cPCEle,"nosite")        
      }
    }).catch((err)=>{
      console.log(err);
    })
  }
  addProdToCart(prodId:string,numberOfProduct:number):Promise<any>{
    return new Promise((aTCResp,aTCRej)=>{
      try {
        let prodDet:Array<any>=this.dataServices.getSiteProd(prodId)
        let productAdded:boolean=this.dataServices.addProdToCart(prodId,prodDet,numberOfProduct)
        aTCResp([this.dataServices.getCartProds(),productAdded])
      } catch (error) {
        aTCRej(error)
      }
    })
  }
  changeNumberOrdered(prodId:string,numberToIncreaseBy:number,type:string):Array<any>{
    let newValue:Array<any>=this.dataServices.changeCartProdNumb(prodId,numberToIncreaseBy,type)
    return newValue
  }
  cPAORADiv(evt:any):void{
    let eleId:any=evt.target.id.slice(7)
    let newProdVals:Array<any>=this.changeNumberOrdered(eleId,1,"add")
    let cPCAORNTBId:string=`#cPCAORNTB${eleId}`
    let cPCAORNTB:any=this.eleRef.nativeElement.querySelector(cPCAORNTBId)
    cPCAORNTB.value=newProdVals[0]
  }
  cPCAORBDiv(evt:any):void{
    let eleId:any=evt.target.id.slice(7)
    let newProdVals:Array<any>=this.changeNumberOrdered(eleId,1,"sabtruct")
    let cPCAORNTBId:string=`#cPCAORNTB${eleId}`
    let cPCAORNTB:any=this.eleRef.nativeElement.querySelector(cPCAORNTBId)
    cPCAORNTB.value=newProdVals[0]
  }
  cPCRPBDiv(evt:any):void{
    let cPCRPBDId:string=evt.target.id.slice(6)
    let removedCartProddetails:Array<any>=this.dataServices.removeCartProd(cPCRPBDId)
    if(removedCartProddetails[2]==true){
      let aTCBId:string=`#aTCB${cPCRPBDId}`
      let cPCId:string=`#cPC${cPCRPBDId}`
      let cPCEle:any=this.eleRef.nativeElement.querySelector(cPCId)
      this.renderer.addClass(cPCEle,"nosite")
      this.eleRef.nativeElement.querySelector(aTCBId).innerText="ADD TO CART"
    }else{
      console.log(removedCartProddetails[2]);
    }
  }
  cPCAORNumbtxtBox(evt:any){
    let valueToset:number=Number(evt.target.value)
    let eleId:any=evt.target.id.slice(9)
    let changed:boolean=this.dataServices.setCartProdNumb(eleId,valueToset)
  }
}
