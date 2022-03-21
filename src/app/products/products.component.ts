import { Component, OnInit,ElementRef, Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { BackendcommunicatorService } from '../backendcommunicator.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public chosenCat:string=""
  public chosenCatId:string=""
  public catProdsArray:any=""
  public baseLink:any=""
  public maxCartProIndex:string=""
  public cartProdScroll:any=[]
  constructor(
    private dataServices:DalalidataService,
    private backEndComms:BackendcommunicatorService,
    private eleRef:ElementRef,
    private renderer:Renderer2
  ) { }
  ngOnInit(): void {
    this.SetCheosenCat()
  }
  ngAfterViewInit(){
    this.dataServices.getMaxProdIndex().then((respMax:any)=>{
      console.log();      
      this.maxCartProIndex=respMax   
      this.getCategoryProducts(this.maxCartProIndex).then((resp:any)=>{
        if(resp.length>0){            
          this.catProdsArray=resp
          this.maxCartProIndex=this.catProdsArray[this.catProdsArray.length-1][12]
        }
        this.bodyScroll()
      })
    })
  }
  SetCheosenCat():void{
    this.chosenCat=this.dataServices.chosenCategory
    this.chosenCatId=this.dataServices.chosenCategoryId
    this.baseLink=this.backEndComms.backendBaseLink
  }
  getCategoryProducts(maxIndex:string):Promise<string>{  
    return new Promise((res:any,rej:any)=>{
      let catProdFormData:FormData=new FormData()
      catProdFormData.append("categoryProductId",this.chosenCatId)
      catProdFormData.append("prodMaxIndex",maxIndex)
      catProdFormData.append("cartName",this.chosenCat)
      this.backEndComms.backendCommunicator(catProdFormData,"post",`${this.backEndComms.backendBaseLink}/getCatProds`).then(resp=>{
        res(resp)
      }).catch((err:any)=>{
        rej(err)
      })
    })
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
  bodyScroll():void{
    window.addEventListener("scroll",()=>{    
      var scrollable = document.documentElement.offsetHeight- (Math.ceil(window.innerHeight*1.5));
      var scrolled = window.scrollY;
      if (Math.ceil(scrolled)>=scrollable) {
        this.getCategoryProducts(this.maxCartProIndex).then((resp:any)=>{
          if(resp.length>0){            
            this.cartProdScroll=resp
            this.maxCartProIndex=this.cartProdScroll[this.cartProdScroll.length-1][12]
          }
        }) 
      }  
  })
  }
}
