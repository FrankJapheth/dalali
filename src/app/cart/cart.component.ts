import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { BackendcommunicatorService } from '../backendcommunicator.service';
import { DalaliWebSocketsService } from '../dalali-web-sockets.service';

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
    private renderer:Renderer2,
    private dWebSockets:DalaliWebSocketsService
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
  private userId:string=this.dataService.userData.userContact
  public displayText:string="Display text"

  ngOnInit(): void {
    this.getProdsArray()
  }

  ngAfterViewInit():void{
    this.pDTPVDDIcon()
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
    let payingContact:string=this.getPayingContact()
    let stored=false
    if(payingContact!=""){
      let cartDBDetails:any=this.crateDBCartDetails()
      let today:Date=new Date()
      let currentStorageDate=today.getDate()+"_"+today.getMonth()+"_"+today.getFullYear()+"at"+
      today.getHours()+"_"+today.getMinutes()+"_"+today.getSeconds()
      let storeUrl:string=this.userName+currentStorageDate.toString()
      let cartDB:any=evt.target.result
      let cDBObjectStore:any=cartDB.createObjectStore(storeUrl,{
        keyPath:"dateStored"})
      cDBObjectStore.transaction.oncomplete=(onCompleteEvent:any)=>{
        let cartObjectStoreTransaction:any=cartDB.transaction(storeUrl,"readwrite").objectStore(
          storeUrl
        )     
        cartObjectStoreTransaction.add(cartDBDetails)
        let cartIdArray:Array<any>=[storeUrl]
        let storedInLocalStorage:boolean=this.storeCartsId(cartIdArray)
        let paymentethod:string=this.dataService.paymentDetails.paymentMethod
        this.setAndSendOrderDetails(storeUrl,payingContact,currentStorageDate.toString(),
        paymentethod)
        if(storedInLocalStorage==true){
          stored=true
        }
      }
    }else{
      let textToDisplay:string="Enter the correct phone number (format is either 07XXXXXXXX or +2547XXXXXXXX )."
      this.openFeedBackLoop(textToDisplay)
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
    cartDBDetails.paymentStatus="pending"
    cartDBDetails.dateStored=this.currentDate
    return cartDBDetails
  }
  changeNumberOrdered(prodId:string,numberToIncreaseBy:number,type:string):Array<any>{
    let newValues:Array<any> =this.dataService.changeCartProdNumb(prodId,numberToIncreaseBy,type)
    return newValues
  }
  pIDCRButton(evt:any):void{
    let docPIDCRButton:any=evt.target
    let newProdVals:Array<any>=this.changeNumberOrdered(docPIDCRButton.id.slice(15),1,"sabtruct")
    if(newProdVals[3]==true){
      let ProdQuantId:string=`#ProdQuant${docPIDCRButton.id.slice(15)}`
      let ProdQuant:any=this.eleRef.nativeElement.querySelector(ProdQuantId)
      ProdQuant.value=newProdVals[0]
      this.totalPrice=newProdVals[1]
      this.totalProductsNumb=newProdVals[2]
    }else{
      this.totalPrice=newProdVals[0]
      this.totalProductsNumb=newProdVals[1]
      let cPBTHPTId:string=`#cPBTHPT${docPIDCRButton.id.slice(15)}`
      let docCPBProductTileHolder:any=this.eleRef.nativeElement.querySelector(".cPBProductTileHolder")
      let cPBTHPTEle:any=this.eleRef.nativeElement.querySelector(cPBTHPTId)
      this.renderer.removeChild(docCPBProductTileHolder,cPBTHPTEle)
    }
  }
  pIDCIButton(evt:any):void{
    let docpIDCIButton:any=evt.target
    let newProdVals:Array<any>=this.changeNumberOrdered(docpIDCIButton.id.slice(12),1,"add")
    if(newProdVals[3]==true){
      let ProdQuantId:string=`#ProdQuant${docpIDCIButton.id.slice(12)}`
      let ProdQuant:any=this.eleRef.nativeElement.querySelector(ProdQuantId)
      ProdQuant.value=newProdVals[0]
      this.totalPrice=newProdVals[1]
      this.totalProductsNumb=newProdVals[2]
    }else{
      let textToDisplay:string="The quantity of the products you are requesting is more than the number in stock"
      this.openFeedBackLoop(textToDisplay)
    }
  }
  prodNumbInput(evt:any){
    let valueToset:any=evt.target.value
    let eleId:any=evt.target.id.slice(9)
    let productDetails:any=this.dataService.getSiteProd(eleId)
    let productQauntity:number=Number(productDetails[3])
    if(valueToset!=""){
      if(isNaN(valueToset)==false){
        if(valueToset>0){
          let changed:boolean=this.dataService.setCartProdNumb(eleId,valueToset)
        }else if(valueToset<=0){
          let cPCRPBDId:string=evt.target.id.slice(9)
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
        if(valueToset>productQauntity){
          let changed:boolean=this.dataService.setCartProdNumb(eleId,productQauntity)
          let textToDisplay:string="The quantity of the products you are requesting is more than the number in stock"
          this.openFeedBackLoop(textToDisplay)       
        }
      }else{
        evt.target.value=1
      }
    }
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


  openingPayingWithMpesaPrompt():void{
    let docmpesaNumber:any=this.eleRef.nativeElement.querySelector(".mpesaNumber")
    this.renderer.removeClass(docmpesaNumber,"nosite")    
  }

  closingPayingWithMpesaPrompt():void{
    let docmpesaNumber:any=this.eleRef.nativeElement.querySelector(".mpesaNumber")
    this.renderer.addClass(docmpesaNumber,"nosite")
  }

  openingPrompt():void{
    let paymentType:string=this.eleRef.nativeElement.querySelector(".pDTPMVString").innerText
    if(paymentType=="M-PESA"){
      if(this.dataService.getUserBasiInfo().userContact!=null){
        if(this.totalPrice>0){
          this.openingPayingWithMpesaPrompt()
        }else{
          let textToDisplay:string="You can't place an order that amounts to 0 shillings."
          this.openFeedBackLoop(textToDisplay)
        }
      }else{
       let textToDisplay:string="You can't purchase something unless you have an account."
        this.openFeedBackLoop(textToDisplay)    
      }
    }else{
      let textToDisplay:string="We support M-Pesa for now."
      this.openFeedBackLoop(textToDisplay)      
    }
  }

  setAndSendOrderDetails(cartId:string,
    payingContact:string,
    dateOrdered:string,
    paymentMethod:string):void{

      let orderId:string=cartId
      let userId:string=this.userId
      let totalProductsOrdered:number=this.totalProductsNumb
      let totalOrderPayment:number=this.totalPrice
      let orderDate:string=dateOrdered
      let contactToPay:string=payingContact
      let methodOfPayment:string=paymentMethod

      let orderFormData:FormData=new FormData()
      orderFormData.append("orderId",orderId)
      orderFormData.append("userId",userId)
      orderFormData.append("totalProductsOrdered",JSON.stringify(totalProductsOrdered))
      orderFormData.append("totalOrderPayment",JSON.stringify(totalOrderPayment))
      orderFormData.append("orderDate",orderDate)
      orderFormData.append("contactToPay",contactToPay)
      orderFormData.append("methodOfPayment",methodOfPayment)
      orderFormData.append("productDetails",JSON.stringify(this.cartProdsDetails))
      
      this.backComms.backendCommunicator(orderFormData,"post",
      `${this.baseLink}/placeOrders`).then((resp:any)=>{
        
          let cartProdTileHolder:any=this.eleRef.nativeElement.querySelector(".cPBProductTileHolder")
          let cartProdTiles:any=this.eleRef.nativeElement.querySelectorAll(".cartProdItemHolder")
          if(cartProdTiles.length>0){
            cartProdTiles.forEach((cartProdTile:any) => {
              this.renderer.removeChild(cartProdTileHolder,cartProdTile)
            });
          }
          this.totalProductsNumb=0
          this.totalPrice=0
          this.closingPayingWithMpesaPrompt()
          this.dataService.clearCartProd()
          let textToDisplay:string=`${resp[0]}`
          this.openFeedBackLoop(textToDisplay)

          let orderDetails:any={
            "orderId":orderId,
            "userId":userId,
            "totalProductsOrdered":totalProductsOrdered,
            "totalOrderPayment":totalOrderPayment,
            "orderDate":orderDate,
            "contactToPay":contactToPay,
            "methodOfPayment":methodOfPayment,
            "productDetails":this.cartProdsDetails
          }

          if( this.dWebSockets.websocketOpen==true ){
            this.dWebSockets.wsSendMsg(JSON.stringify(resp[1]),JSON.stringify(orderDetails))
          }else{
            console.log("websocket closed");
          }

        let mPesaConfirmationDemoForm:FormData=new FormData()
        mPesaConfirmationDemoForm.append("payingContact","+254728583967")
        mPesaConfirmationDemoForm.append("amountPaid",JSON.stringify(totalOrderPayment))
        mPesaConfirmationDemoForm.append("transactionCode","FE2EH0TV9CH0")

        this.backComms.backendCommunicator(mPesaConfirmationDemoForm,"post",
        `${this.baseLink}/mPesaConfirmation`).then((resp:any)=>{
          if(resp==true){
            this.backComms.backendCommunicator(mPesaConfirmationDemoForm,"post",
            `${this.baseLink}/completeMPesaPayment`).then((resp:any)=>{
              console.log(resp);
            })
          }        
        })
      })
  }

  getPayingContact():string{
    let payingContactToSend:string=""
    let payingContact:string=this.eleRef.nativeElement.querySelector("#payingContact").value
    let typeOfContact:string=this.checkContact(payingContact)
    if(typeOfContact!="phone"){
      payingContactToSend=""
    }else{
      payingContactToSend=payingContact
    }
    return payingContactToSend
  }

  checkContact(contact:string):string{
    let typeOfContact:string=""
    const phoneexpression:RegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    const mailformat:RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(contact.match(phoneexpression)){
          typeOfContact="phone"
        }else if(contact.match(mailformat)){
            typeOfContact="email"
        }else{
          typeOfContact="undetermined"
        }
    return typeOfContact
  }

  closeFeedbackLoop():void{
    let fBLoop:any=this.eleRef.nativeElement.querySelector(".sWFLMain")
    this.renderer.addClass(fBLoop,"nosite")
  }

  openFeedBackLoop(textToDisplay:string):void{
    this.displayText=textToDisplay
    let fBLoop:any=this.eleRef.nativeElement.querySelector(".sWFLMain")
    this.renderer.removeClass(fBLoop,"nosite")
  }
}
