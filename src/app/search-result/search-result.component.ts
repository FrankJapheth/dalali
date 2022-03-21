import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { BackendcommunicatorService } from '../backendcommunicator.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  constructor(
    private dataServices:DalalidataService,
    private backendComms:BackendcommunicatorService,
    public eleRef:ElementRef,
    public renderer:Renderer2
  ) { }
  
  public searchTearm:string=this.dataServices.searchTerm
  public productSearchReasults:any=this.dataServices.prodSearchResult
  public baseLink:string=this.backendComms.backendBaseLink
  public maxSearchProdIndex:string=this.productSearchReasults[this.productSearchReasults.length-1][12]
  public scrollSearchedProducts:any=[]
  ngOnInit(): void {
  }

  ngAfterViewInit():void{
    this.bodyScroll()
    this.productSearchReasults.forEach((prodSearReselement:any) => {
      this.dataServices.addSiteProd(prodSearReselement[0],prodSearReselement)
    });
  }
  changeNumberOrdered(prodId:string,numberToIncreaseBy:number,type:string):Array<any>{
    let newValues:Array<any>=this.dataServices.changeCartProdNumb(prodId,numberToIncreaseBy,type)
    return newValues
  }
  
  cPCAORBDiv(evt:any):void{
    let eleId:any=evt.target.id.slice(7)
    let newProdVals:Array<any>=this.changeNumberOrdered(eleId,1,"sabtruct")
    let cPCAORNTBId:string=`#cPCAORNTB${eleId}`
    let cPCAORNTB:any=this.eleRef.nativeElement.querySelector(cPCAORNTBId)
    cPCAORNTB.value=newProdVals[0]
  }
  cPCAORNumbtxtBox(evt:any){
    let valueToset:number=Number(evt.target.value)
    let eleId:any=evt.target.id.slice(9)
    let changed:boolean=this.dataServices.setCartProdNumb(eleId,valueToset)
  }
  cPAORADiv(evt:any):void{
    let eleId:any=evt.target.id.slice(7)
    let newProdVals:Array<any>=this.changeNumberOrdered(eleId,1,"add")
    let cPCAORNTBId:string=`#cPCAORNTB${eleId}`
    let cPCAORNTB:any=this.eleRef.nativeElement.querySelector(cPCAORNTBId)
    cPCAORNTB.value=newProdVals[0]
  }
  cPCRPBDiv(evt:any):void{
    let cPCRPBDId:string=evt.target.id.slice(6)
    let removedCartProdDetails:Array<any>=this.dataServices.removeCartProd(cPCRPBDId)
    if(removedCartProdDetails[2]==true){
      let cPCId:string=`#cPC${cPCRPBDId}`
      let aTCBId:string=`#aTCB${cPCRPBDId}`
      let cPCEle:any=this.eleRef.nativeElement.querySelector(cPCId)
      this.renderer.addClass(cPCEle,"nosite")
      this.eleRef.nativeElement.querySelector(aTCBId).innerText="ADD TO CART"
    }else{
      console.log(removedCartProdDetails[2]);
    }
  }
  addToCartBut(evt:any):void{
    let aTCBId:string=evt.target.id.slice(4)
    let cPCAORNTBId:string=`#cPCAORNTB${aTCBId}`
    let cPCAORNTBIdValue:number=this.eleRef.nativeElement.querySelector(cPCAORNTBId).value
    this.addProdToCart(aTCBId,cPCAORNTBIdValue).then((respProdAddition)=>{
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
  productSearchScroll():void{
      let searchForm:FormData=new FormData()
      searchForm.append("prodIdentity",this.searchTearm)
      searchForm.append("maxProdIndex",this.maxSearchProdIndex)
      this.backendComms.backendCommunicator(searchForm,"post",`${this.backendComms.backendBaseLink}/searchProds`).then(resp=>{
        if(resp.length>0){
          this.scrollSearchedProducts=resp
          this.dataServices.siteProds.concat(resp)
          this.maxSearchProdIndex=this.scrollSearchedProducts[this.scrollSearchedProducts.length-1][12]
        }
      })
  }
  bodyScroll():void{
    window.addEventListener("scroll",()=>{    
      var scrollable = document.documentElement.offsetHeight- (Math.ceil(window.innerHeight*1.5));
      var scrolled = window.scrollY;
      if (Math.ceil(scrolled)>=scrollable) {
        this.productSearchScroll()
      }  
  })
  }
}
