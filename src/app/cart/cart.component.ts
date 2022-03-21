import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { BackendcommunicatorService } from '../backendcommunicator.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor(
    private dataService:DalalidataService,
    private backComms:BackendcommunicatorService,
    private eleRef:ElementRef,
    private renderer:Renderer2
  ) { }
  
  public cartProds:any=this.dataService.getCartProds()
  public cartProdsIds:any=this.cartProds[0]
  public cartProdsArray:Array<any>=[]
  public cartProdsDetails:any=this.cartProds[1]
  public baseLink:string=this.backComms.backendBaseLink
  public totalPrice:number=0
  public totalProductsNumb:number=0
  public currentDate:any=0
  public paymentMethods:any=[]
  public userName:any=null
  ngOnInit(): void {
    this.getProdsArray()
  }

  ngAfterViewInit():void{
    this.pDTPVDDIcon()
    this.crateDBCartDetails()
    this.oSBDiv()
  }

  getProdsArray():void{
    this.userName=this.dataService.userData.userName
    this.totalPrice=this.dataService.getTotalCartProductsPrice()
    this.totalProductsNumb=this.dataService.getTotalNuberOfProducts()
    this.dataService.getPaymentMethods().then((resp:any)=>{
      this.paymentMethods=resp   
    })
    let today:Date=new Date()
    this.currentDate=today.getDate()+" / "+today.getMonth()+" / "+today.getFullYear()+" at "+
    today.getHours()+" : "+today.getMinutes()+" : "+today.getSeconds()
    let partialProdsArray:Array<any>=[]
    for (let index = 0; index < this.cartProdsIds.length; index++) {
      const cartProdsId:any = this.cartProdsIds[index];
      partialProdsArray.push(this.cartProdsDetails[cartProdsId])
    }
    this.cartProdsArray=partialProdsArray  
  }
  pMListItem(evt:any):void{
    let lItem:any=evt.target
    let lItemValue:string=lItem.innerText
    let pDTPMVString:any=this.eleRef.nativeElement.querySelector(".pDTPMVString")
    pDTPMVString.innerText=lItemValue
    let paymentMethodsList:any=this.eleRef.nativeElement.querySelector(".paymentMethodsList")
    this.renderer.addClass(paymentMethodsList,"nosite")
  }
  pDTPVDDIcon():void{
    let pDTPVDDIcon:any=this.eleRef.nativeElement.querySelector(".pDTPVDDIcon")
    this.renderer.listen(pDTPVDDIcon,"click",()=>{
      let paymentMethodsList:any=this.eleRef.nativeElement.querySelector(".paymentMethodsList")
      this.renderer.removeClass(paymentMethodsList,"nosite")      
    })
  }
  dbDataStorage(evt:any):boolean{
    let stored=false
    let cartDBDetails:any=this.crateDBCartDetails()
    let today:Date=new Date()
    let currentStorageDate=today.getDate()+"_"+today.getMonth()+"_"+today.getFullYear()+"at"+
    today.getHours()+"_"+today.getMinutes()+"_"+today.getSeconds()
    let storeUrls:string=this.userName+currentStorageDate.toString()
    let cartDB:any=evt.target.result
    let cDBObjectStore:any=cartDB.createObjectStore(storeUrls,{
      keyPath:"dateStored"})
    console.log("Crated store");    
    cDBObjectStore.transaction.oncomplete=(onCompleteEvent:any)=>{
      let cartObjectStoreTransaction:any=cartDB.transaction(storeUrls,"readwrite").objectStore(
        storeUrls
      )     
      cartObjectStoreTransaction.add(cartDBDetails)
      let cartIdArray:Array<any>=[storeUrls]
      let storedInLocalStorage:boolean=this.storeCartsId(cartIdArray)
      if(storedInLocalStorage==true){
        stored=true
      }
    }
    return stored
  }
  storeCartDetails():void{
    let userDbVersions:any=localStorage.getItem("cartDbVersions")
    if(userDbVersions==null){
      userDbVersions=1
      localStorage.setItem("cartDbVersions",userDbVersions)
    }else{
      userDbVersions=Number(userDbVersions)
    }
    let cartDBRequest:any=window.indexedDB.open("dalaliCart",userDbVersions)
    userDbVersions+=1
    localStorage.setItem("cartDbVersions",userDbVersions)
    cartDBRequest.onerror=(errorEvt:any)=>{
      console.log("Storage was not accessed becouse of the following"+errorEvt.target.errorCode);      
    }
    cartDBRequest.onupgradeneeded=(upgradeEvt:any)=>{
      let stored:boolean=this.dbDataStorage(upgradeEvt)
    }
    cartDBRequest.onsuccess=(successEvt:any)=>{
      console.log("Opened successfully");      
    }
  }
  storeCartsId(cartIdsToStore:any):boolean{
    let stored:boolean=false
    let cartsIds:any=localStorage.getItem("cartIds")
    if(cartsIds==null){
      cartsIds=cartIdsToStore
      localStorage.setItem("cartIds",JSON.stringify(cartsIds))
      stored=true
    }else{
      let cartsIdsLocal:any=JSON.parse(cartsIds)
      cartIdsToStore.forEach((cITSEle:any) => {
        cartsIdsLocal.push(cITSEle)
      });
      localStorage.setItem("cartIds",JSON.stringify(cartsIdsLocal))
      stored=true
    }
    return stored
  }

  crateDBCartDetails():object{
    let cartDBDetails:any={}
    let totalAmount:any=this.eleRef.nativeElement.querySelector(".pDTAValue").innerText
    let numberOfProducts:any=this.eleRef.nativeElement.querySelector(".pDTTOPValue").innerText
    let paymentMethod:any=this.eleRef.nativeElement.querySelector(".pDTPMVString").innerText
    let dateOrdered:any=this.eleRef.nativeElement.querySelector(".pDTDOValue").innerText
    let cartPymentDetails:object=this.dataService.setPaymentDetails(totalAmount,numberOfProducts,paymentMethod,dateOrdered)
    let cartProdIdArray:Array<any>=this.dataService.cartProductsArray
    let cartProductsDetails:object=this.cartProdsDetails
    cartDBDetails.cartProductsIdsArray=cartProdIdArray
    cartDBDetails.productDetails=cartProductsDetails
    cartDBDetails.paymentDetails=cartPymentDetails
    cartDBDetails.paymentStatus=false
    cartDBDetails.dateStored=this.currentDate
    return cartDBDetails
  }
  oSBDiv():void{
    let docOSBDiv:any=this.eleRef.nativeElement.querySelector(".oSBDiv")
    this.renderer.listen(docOSBDiv,"click",()=>{
      this.storeCartDetails()
    })
  }
  changeNumberOrdered(prodId:string,numberToIncreaseBy:number,type:string):Array<any>{
    let newValues:Array<any> =this.dataService.changeCartProdNumb(prodId,numberToIncreaseBy,type)
    return newValues
  }
  pIDCRButton(evt:any):void{
    let docPIDCRButton:any=evt.target
    let newProdVals:Array<any>=this.changeNumberOrdered(docPIDCRButton.id.slice(15),1,"sabtruct")
    let ProdQuantId:string=`#ProdQuant${docPIDCRButton.id.slice(15)}`
    let ProdQuant:any=this.eleRef.nativeElement.querySelector(ProdQuantId)
    ProdQuant.value=newProdVals[0]
    this.totalPrice=newProdVals[1]
    this.totalProductsNumb=newProdVals[2]
  }
  pIDCIButton(evt:any):void{
    let docpIDCIButton:any=evt.target
    let newProdVals:Array<any>=this.changeNumberOrdered(docpIDCIButton.id.slice(12),1,"add")
    let ProdQuantId:string=`#ProdQuant${docpIDCIButton.id.slice(12)}`
    let ProdQuant:any=this.eleRef.nativeElement.querySelector(ProdQuantId)
    ProdQuant.value=newProdVals[0]
    this.totalPrice=newProdVals[1]
    this.totalProductsNumb=newProdVals[2]
  }
  pDSPNRbutton(evt:any):void{
    let cPCRPBDId:string=evt.target.id.slice(7)
    let removedCartProddetails:Array<any>=this.dataService.removeCartProd(cPCRPBDId)
    if(removedCartProddetails[2]==true){
      this.totalPrice=removedCartProddetails[0]
      this.totalProductsNumb=removedCartProddetails[1]
      let cPBTHPTId:string=`#cPBTHPT${cPCRPBDId}`
      let docCPBProductTileHolder:any=this.eleRef.nativeElement.querySelector(".cPBProductTileHolder")
      let cPBTHPTEle:any=this.eleRef.nativeElement.querySelector(cPBTHPTId)
      this.renderer.removeChild(docCPBProductTileHolder,cPBTHPTEle)
    }
  }
}
