import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { BackendcommunicatorService } from '../backendcommunicator.service';
import { DalaliCachesService } from '../dalali-caches.service';

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
    private backEndComms:BackendcommunicatorService,
    private dalaliCache: DalaliCachesService
  ) { }
  
  public bEBaseLink=this.backEndComms.backendBaseLink

  @Input() catId:any
  @Input() catName:any
  public productCategoriesDetails:any=[]
  public catProdsArray:any=[]
  public displayText:string="Display text"
  public classType:string=""

  ngOnInit(): void {
  }
  ngAfterViewInit():void{
    this.dataServices.getMaxProdIndex().then((respmax:any)=>{ 
      this.getCategoryProducts(respmax).then((resp:any)=>{
        if(resp.length>0){
          this.catProdsArray=resp
          let prodToDisp:any=this.storeFetchedProdDetails(resp)
          return prodToDisp
        }else{
          let categoryContainer:any=this.eleRef.nativeElement.querySelector(".categoryDiv")
          this.renderer.addClass(categoryContainer,"nosite")
        }
      })
    })
  }
  ngAfterViewChecked():void{
    let storedProds:any=this.dataServices.getSiteProdsList()
    storedProds.forEach((storedProd:any) => {
      let ele:any=this.eleRef.nativeElement.querySelector(`#cPC${storedProd[0].trim()}`)
      let addBut:any=this.eleRef.nativeElement.querySelector(`#aTCB${storedProd[0].trim()}`)
      if(ele!=null){
        if(this.dataServices.cartProductsArray.includes(storedProd[0])){
          this.renderer.removeClass(ele,"nosite")
          addBut.innerText="REMOVE"
        }
      }      
    });  
  }
  getCategoryProducts(maxIndex:string):Promise<string>{  
    return new Promise((res:any)=>{
      const cacheRequestLink: string = `${this.backEndComms.backendBaseLink}/getCatProds${this.catId}`;
      const sessionCacheName: string = this.dalaliCache.cacheName;
      const rawDalaliSessionCache: any =sessionStorage.getItem('dalaliSessionCache')
      const dalaliSessionCache: any =JSON.parse(rawDalaliSessionCache)
      if ( dalaliSessionCache !== null ){
        if(!dalaliSessionCache.includes(cacheRequestLink)){
          const requestLink: string = `${this.backEndComms.backendBaseLink}/getCatProds`;
          let catProdFormData:FormData=new FormData()
          catProdFormData.append("categoryProductId",this.catId)
          catProdFormData.append("prodMaxIndex",maxIndex)
          catProdFormData.append("cartName",this.catName)
          this.backEndComms.backendCommunicator(catProdFormData,"post",requestLink).then(resp=>{
            const responseData: any = resp
            this.dalaliCache.storeLinkToCache(cacheRequestLink);
            this.dalaliCache.putContent(sessionCacheName,cacheRequestLink,responseData).then(() => {
              res(resp)
            });
          });
        }else{
          this.dalaliCache.getCacheResponse(sessionCacheName,cacheRequestLink).then((cacheResp: any) => {            
            res(cacheResp)
          });
        }
      }else{
        const requestLink: string = `${this.backEndComms.backendBaseLink}/getCatProds`;
        let catProdFormData:FormData=new FormData()
        catProdFormData.append("categoryProductId",this.catId)
        catProdFormData.append("prodMaxIndex",maxIndex)
        catProdFormData.append("cartName",this.catName)
        this.backEndComms.backendCommunicator(catProdFormData,"post",requestLink).then(resp=>{
          const responseData: any = resp
          this.dalaliCache.storeLinkToCache(cacheRequestLink);
          this.dalaliCache.putContent(sessionCacheName,cacheRequestLink,responseData).then(() => {
            res(resp)
          });
        });
      }
    })
  }
  storeFetchedProdDetails(prodsDetails:Array<any>):Array<any>{
    for (let prodDet = 0; prodDet < prodsDetails.length; prodDet++) {
      const prodDetEle = prodsDetails[prodDet];
      let siteProd:any=this.dataServices.getSiteProd(prodDetEle[0])
      if(siteProd==undefined){
        this.dataServices.addSiteProd(prodDetEle[0],prodDetEle)    
      }
    } 
    let prodList:Array<any>=this.dataServices.getSiteProdsList()
    return prodList
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
    if(newProdVals[3]==true){
      let cPCAORNTBId:string=`#cPCAORNTB${eleId}`
      let cPCAORNTB:any=this.eleRef.nativeElement.querySelector(cPCAORNTBId)
      cPCAORNTB.value=newProdVals[0]
    }else{
      this.displayText="The quantity of the products you are requesting is more than the number in stock"
      this.openFeedBackLoop()
    }
  }
  cPCAORBDiv(evt:any):void{
    let eleId:any=evt.target.id.slice(7)
    let newProdVals:Array<any>=this.changeNumberOrdered(eleId,1,"sabtruct")
    if(newProdVals[3]==true){
      let cPCAORNTBId:string=`#cPCAORNTB${eleId}`
      let cPCAORNTB:any=this.eleRef.nativeElement.querySelector(cPCAORNTBId)
      cPCAORNTB.value=newProdVals[0]
    }else{
      let aTCBId:string=`#aTCB${eleId}`
      let cPCId:string=`#cPC${eleId}`
      let cPCEle:any=this.eleRef.nativeElement.querySelector(cPCId)
      this.renderer.addClass(cPCEle,"nosite")
      this.eleRef.nativeElement.querySelector(aTCBId).innerText="ADD TO CART"
    }
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
    let valueToset:any=evt.target.value
    if(valueToset!=""){
      if(isNaN(valueToset)==false){
        let eleId:any=evt.target.id.slice(9)
        let productDetails:any=this.dataServices.getSiteProd(eleId)
        let productQauntity:number=Number(productDetails[3])
        
        if(valueToset>0){
          this.dataServices.setCartProdNumb(eleId,valueToset)
        }else if(valueToset<=0){
          let cPCRPBDId:string=evt.target.id.slice(9)
          let removedCartProddetails:Array<any>=this.dataServices.removeCartProd(cPCRPBDId)
          if(removedCartProddetails[2]==true){
            let aTCBId:string=`#aTCB${cPCRPBDId}`
            let cPCId:string=`#cPC${cPCRPBDId}`
            let cPCEle:any=this.eleRef.nativeElement.querySelector(cPCId)
            this.renderer.addClass(cPCEle,"nosite")
            this.eleRef.nativeElement.querySelector(aTCBId).innerText="ADD TO CART"
            evt.target.value=1
          }        
        }
        if(valueToset>productQauntity){
          this.dataServices.setCartProdNumb(eleId,productQauntity)
          evt.target.value=productQauntity
          this.displayText="The quantity of the products you are requesting is more than the number in stock"
          this.openFeedBackLoop()          
        }
      }else{
        console.log("only numbers allowed");
        evt.target.value=1
      }
    }
  }

  closeFeedbackLoop():void{
    let fBLoop:any=this.eleRef.nativeElement.querySelector(".sWFLMain")
    this.renderer.addClass(fBLoop,"nosite")
  }

  openFeedBackLoop():void{
    let fBLoop:any=this.eleRef.nativeElement.querySelector(".sWFLMain")
    this.renderer.removeClass(fBLoop,"nosite")
  }
}
