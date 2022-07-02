import { Component, OnInit, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';
import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';
import { DalaliWebSocketsService } from '../service/webSocket/dalali-web-sockets.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit,AfterViewInit {

  public cartProds: any=this.dataService.getCartProds();
  public cartProdsIds: any=this.cartProds[0];
  public cartProdsArray: Array<any>=[];
  public cartProdsDetails: any=this.cartProds[1];
  public baseLink: string=this.backComms.backendBaseLink;
  public totalPrice: number=0;
  public totalProductsNumb: number=0;
  public currentDate: any=0;
  public paymentMethods: any=[];
  public userName: any=null;
  public displayText: string='Display text';
  public orderPayingContact: string = '';
  private userId: string=this.dataService.userData.userContact;
  private formattedCartProdDetails: any ={};
  private prodNumbFailedOrder: any = {};
  public calcHeight: number = window.innerHeight-70

  constructor(
    private dataService: DalalidataService,
    private backComms: BackendcommunicatorService,
    private eleRef: ElementRef,
    private renderer: Renderer2,
    private dWebSockets: DalaliWebSocketsService
  ) { }

  ngOnInit(): void {
    this.getProdsArray();
  }

  ngAfterViewInit(): void{
    this.pDTPVDDIcon();
    this.renderer.setStyle(this.eleRef.nativeElement.querySelector('.cartPage'),'height',this.calcHeight+'px')
  }

  getProdsArray(): void{
    this.userName=this.dataService.userData.userName;
    this.totalPrice=this.dataService.getTotalCartProductsPrice();
    this.totalProductsNumb=this.dataService.getTotalNuberOfProducts();
    this.dataService.getPaymentMethods().then((resp: any)=>{
      this.paymentMethods=resp;
    });
    const today: Date=new Date();
    this.currentDate=today.getDate()+' / '+today.getMonth()+' / '+today.getFullYear()+' at '+
    today.getHours()+' : '+today.getMinutes()+' : '+today.getSeconds();
    const partialProdsArray: Array<any>=[];
    for (const cartProdsId of this.cartProdsIds) {
      partialProdsArray.push(this.cartProdsDetails[cartProdsId]);
    }
    this.cartProdsArray=partialProdsArray;
  }
  pMListItem(evt: any): void{
    const lItem: any=evt.target;
    const lItemValue: string=lItem.innerText;
    const pDTPMVString: any=this.eleRef.nativeElement.querySelector('.pDTPMVString');
    pDTPMVString.innerText=lItemValue;
    const paymentMethodsList: any=this.eleRef.nativeElement.querySelector('.paymentMethodsList');
    this.renderer.addClass(paymentMethodsList,'nosite');
  }
  pDTPVDDIcon(): void{
    const pDTPVDDIcon: any=this.eleRef.nativeElement.querySelector('.pDTPVDDIcon');
    this.renderer.listen(pDTPVDDIcon,'click',()=>{
      const paymentMethodsList: any=this.eleRef.nativeElement.querySelector('.paymentMethodsList');
      this.renderer.removeClass(paymentMethodsList,'nosite');
    });
  }

  dbDataStorage(evt: any,cartDbVersions: number): boolean{

    let stored=false;

    const cartDB: any=evt.target.result;

    const cartDBDetails: any=this.crateDBCartDetails(this.orderPayingContact);

    const storeUrl='userCart';

    let cDBObjectStore: any=null;
    if( cartDbVersions > 1){
      cDBObjectStore =evt.target.transaction.objectStore(storeUrl,{keyPath:'orderdate'});
    }else{
      cDBObjectStore =cartDB.createObjectStore(storeUrl,{keyPath:'orderdate'});
    }

    cDBObjectStore.transaction.oncomplete=()=>{

      const cartObjectStoreTransaction: any=cartDB.transaction(
        storeUrl,'readwrite').objectStore(storeUrl
      );
      cartObjectStoreTransaction.add(cartDBDetails);

      const cartIdArray: Array<any>=[{orderId:cartDBDetails.orderdate,totalBill:cartDBDetails.totalBill}];
      const storedInLocalStorage: boolean=this.storeCartsId(cartIdArray,'success');

      this.setAndSendOrderDetails(cartDBDetails.orderdate,cartDBDetails);

      if(storedInLocalStorage===true){
        stored=true;
      }

    };
    return stored;
  }

  storeCartDetails(): void{
    const payingContact: string=this.getPayingContact();
    if(payingContact!==''){
      const cartProdsKeys = Object.keys(this.cartProdsDetails);
      let newTotalPrice =0;
      let newTotalNumber =0;
      this.orderPayingContact=payingContact;

      for (const prodId of cartProdsKeys){
        const siteProdLimit= this.dataService.getSiteProd(prodId)[3];

        // eslint-disable-next-line @typescript-eslint/quotes
        const productDescription: string= this.cartProdsDetails[prodId][0][1].replace("'","_aps_")+
          ' '+this.cartProdsDetails[prodId][0][2];
        const productPrice = Number(this.cartProdsDetails[prodId][0][5]);
        const quantityOrdered = Number(this.cartProdsDetails[prodId][1]);

        const orderedProductDetails = {
          productDescription,
          productPrice,
          quantityOrdered
        };

        if (quantityOrdered>siteProdLimit ){

          this.prodNumbFailedOrder[prodId]=orderedProductDetails;

        }else{

          this.formattedCartProdDetails[prodId]=orderedProductDetails;

          newTotalNumber+=quantityOrdered;
          newTotalPrice+=productPrice*quantityOrdered;

        }

      }


      this.totalPrice=newTotalPrice;
      this.totalProductsNumb=newTotalNumber;
      let userDbVersions: any=localStorage.getItem('cartDbVersions');

      if(userDbVersions==null){
        userDbVersions=1;
        localStorage.setItem('cartDbVersions',userDbVersions);
      }else{
        userDbVersions=Number(userDbVersions);
        userDbVersions+=1;
        localStorage.setItem('cartDbVersions',userDbVersions);
      }

      const cartDBRequest: any=window.indexedDB.open('dalaliCart',userDbVersions);

      cartDBRequest.onerror=(errorEvt: any)=>{
        console.log('Storage was not accessed becouse of the following'+errorEvt.target.errorCode);
      };
      cartDBRequest.onupgradeneeded=(upgradeEvt: any)=>{
        this.dbDataStorage(upgradeEvt,userDbVersions);
      };
    }else{
      const textToDisplay='Enter the correct phone number (format is 2547XXXXXXXX ).';
      this.openFeedBackLoop(textToDisplay);
    }
  }
  storeCartsId(cartIdsToStore: any,orderType: string): boolean{
    let stored=false;
    if ( orderType === 'failed'){
      let failedCartsIds: any=localStorage.getItem('failedCartIds');
      if(failedCartsIds==null){
        failedCartsIds=cartIdsToStore;
        localStorage.setItem('cartIds',JSON.stringify(failedCartsIds));
        stored=true;
      }else{
        const cartsIdsLocal: any=JSON.parse(failedCartsIds);
        cartIdsToStore.forEach((cITSEle: any) => {
          cartsIdsLocal.push(cITSEle);
        });
        localStorage.setItem('failedCartIds',JSON.stringify(cartsIdsLocal));
        stored=true;
      }

    }else{
      let cartsIds: any=localStorage.getItem('cartIds');
      if(cartsIds==null){
        cartsIds=cartIdsToStore;
        localStorage.setItem('cartIds',JSON.stringify(cartsIds));
        stored=true;
      }else{
        const cartsIdsLocal: any=JSON.parse(cartsIds);
        cartIdsToStore.forEach((cITSEle: any) => {
          cartsIdsLocal.push(cITSEle);
        });
        localStorage.setItem('cartIds',JSON.stringify(cartsIdsLocal));
        stored=true;
      }
    }
    return stored;
  }

  crateDBCartDetails(paymentContact: string): object{

    const totalBill: any=this.totalPrice;
    const totalProductsOrdered: any=this.totalProductsNumb;
    const paymentMethod: any=this.eleRef.nativeElement.querySelector('.pDTPMVString').innerText;
    const orderdate: any=this.eleRef.nativeElement.querySelector('.pDTDOValue').innerText;

    const productsOrdered=JSON.stringify(this.formattedCartProdDetails);
    const productsIds: Array<any>=this.dataService.cartProductsArray;
    const status='pending';

    const cartDBDetails={
      orderdate,
      paymentContact,
      productsOrdered,
      totalProductsOrdered,
      totalBill,
      paymentMethod,
      productsIds,
      status
    };

    this.dataService.setPaymentDetails(
      totalBill,totalProductsOrdered,paymentMethod,orderdate);

    return cartDBDetails;
  }
  changeNumberOrdered(prodId: string,numberToIncreaseBy: number,type: string): Array<any>{
    const newValues: Array<any> =this.dataService.changeCartProdNumb(prodId,numberToIncreaseBy,type);
    return newValues;
  }
  pIDCRButton(evt: any): void{
    const docPIDCRButton: any=evt.target;
    const newProdVals: Array<any>=this.changeNumberOrdered(docPIDCRButton.id.slice(15),1,'sabtruct');
    if(newProdVals[3]===true){
      const prodQuantId=`#ProdQuant${docPIDCRButton.id.slice(15)}`;
      const prodQuant: any=this.eleRef.nativeElement.querySelector(prodQuantId);
      prodQuant.value=newProdVals[0];
      this.totalPrice=newProdVals[1];
      this.totalProductsNumb=newProdVals[2];
    }else{
      this.totalPrice=newProdVals[0];
      this.totalProductsNumb=newProdVals[1];
      const cPBTHPTId=`#cPBTHPT${docPIDCRButton.id.slice(15)}`;
      const docCPBProductTileHolder: any=this.eleRef.nativeElement.querySelector('.cPBProductTileHolder');
      const cPBTHPTEle: any=this.eleRef.nativeElement.querySelector(cPBTHPTId);
      this.renderer.removeChild(docCPBProductTileHolder,cPBTHPTEle);
    }
  }
  pIDCIButton(evt: any): void{
    const docpIDCIButton: any=evt.target;
    const newProdVals: Array<any>=this.changeNumberOrdered(docpIDCIButton.id.slice(12),1,'add');
    if(newProdVals[3]===true){
      const prodQuantId=`#ProdQuant${docpIDCIButton.id.slice(12)}`;
      const prodQuant: any=this.eleRef.nativeElement.querySelector(prodQuantId);
      prodQuant.value=newProdVals[0];
      this.totalPrice=newProdVals[1];
      this.totalProductsNumb=newProdVals[2];
    }else{
      const textToDisplay='The quantity of the products you are requesting is more than the number in stock';
      this.openFeedBackLoop(textToDisplay);
    }
  }
  prodNumbInput(evt: any){
    const valueToset: any=evt.target.value;
    const eleId: any=evt.target.id.slice(9);
    const productDetails: any=this.dataService.getSiteProd(eleId);
    const productQauntity=Number(productDetails[3]);
    if(valueToset!==''){
      if(isNaN(valueToset)===false){
        if(valueToset>0){
          this.dataService.setCartProdNumb(eleId,valueToset);
        }else if(valueToset<=0){
          const cPCRPBDId: string=evt.target.id.slice(9);
          const removedCartProddetails: Array<any>=this.dataService.removeCartProd(cPCRPBDId);
          if(removedCartProddetails[2]===true){
            this.totalPrice=removedCartProddetails[0];
            this.totalProductsNumb=removedCartProddetails[1];
            const cPBTHPTId=`#cPBTHPT${cPCRPBDId}`;
            const docCPBProductTileHolder: any=this.eleRef.nativeElement.querySelector('.cPBProductTileHolder');
            const cPBTHPTEle: any=this.eleRef.nativeElement.querySelector(cPBTHPTId);
            this.renderer.removeChild(docCPBProductTileHolder,cPBTHPTEle);
          }
        }
        if(valueToset>productQauntity){
          this.dataService.setCartProdNumb(eleId,productQauntity);
          const textToDisplay='The quantity of the products you are requesting is more than the number in stock';
          this.openFeedBackLoop(textToDisplay);
        }
      }else{
        evt.target.value=1;
      }
    }
  }
  pDSPNRbutton(evt: any): void{
    const cPCRPBDId: string=evt.target.id.slice(7);
    const removedCartProddetails: Array<any>=this.dataService.removeCartProd(cPCRPBDId);
    if(removedCartProddetails[2]===true){
      this.totalPrice=removedCartProddetails[0];
      this.totalProductsNumb=removedCartProddetails[1];
      const cPBTHPTId=`#cPBTHPT${cPCRPBDId}`;
      const docCPBProductTileHolder: any=this.eleRef.nativeElement.querySelector('.cPBProductTileHolder');
      const cPBTHPTEle: any=this.eleRef.nativeElement.querySelector(cPBTHPTId);
      this.renderer.removeChild(docCPBProductTileHolder,cPBTHPTEle);
    }
  }


  openingPayingWithMpesaPrompt(): void{
    const docmpesaNumber: any=this.eleRef.nativeElement.querySelector('.mpesaNumber');
    this.renderer.removeClass(docmpesaNumber,'nosite');
  }

  closingPayingWithMpesaPrompt(): void{
    const docmpesaNumber: any=this.eleRef.nativeElement.querySelector('.mpesaNumber');
    this.renderer.addClass(docmpesaNumber,'nosite');
  }

  openingPrompt(): void{
    const paymentType: string=this.eleRef.nativeElement.querySelector('.pDTPMVString').innerText;
    if(paymentType==='M-PESA'){
      if(this.dataService.getUserBasiInfo().userContact!=null){
        if(this.totalPrice>0){
          this.openingPayingWithMpesaPrompt();
        }else{
          const textToDisplay='You can\'t place an order that amounts to 0 shillings.';
          this.openFeedBackLoop(textToDisplay);
        }
      }else{
       const textToDisplay='You can\'t purchase something unless you have an account.';
        this.openFeedBackLoop(textToDisplay);
      }
    }else{
      const textToDisplay='We support M-Pesa for now.';
      this.openFeedBackLoop(textToDisplay);
    }
  }

  setAndSendOrderDetails(cartId: string,cartDetails: any): void{

      const orderId: string=cartId;
      const userId: string=this.userId;

      const orderFormData: FormData=new FormData();
      orderFormData.append('orderId',orderId);
      orderFormData.append('customerId',userId);
      orderFormData.append('customerName',this.dataService.userData.userName);
      orderFormData.append('cartDetails',JSON.stringify(cartDetails));

      this.backComms.backendCommunicator(orderFormData,'post',
      `${this.baseLink}/placeOrders`).then((orderPlacedResp: any)=>{
        this.closingPayingWithMpesaPrompt();

        if (orderPlacedResp == 'failed'){
          this.openFeedBackLoop("Failed to place order.");
          const rawPendingOrders: any = localStorage.getItem('cartIds');
          const pendingOrders: Array<any> = JSON.parse(rawPendingOrders);
          for (const pendingOrder of pendingOrders){
            if (pendingOrder.orderId == orderId){
              pendingOrders.splice(pendingOrders.indexOf(pendingOrder),1);
            }
          }
          localStorage.setItem('cartIds',JSON.stringify(pendingOrders));

          const rawFailedOrders: any = localStorage.getItem('failedOrders');
          if(rawFailedOrders == null){
            const failedOrders: Array<any> = [{orderId,totalBill:cartDetails.totalBill}];
            localStorage.setItem('failedOrders',JSON.stringify(failedOrders));
          }else{
            const failedOrders: Array<any> = JSON.parse(rawFailedOrders);
            failedOrders.push({orderId,totalBill:cartDetails.totalBill});
            localStorage.setItem('failedOrders',JSON.stringify(failedOrders));
          }
        }else if(orderPlacedResp=="pending order"){
          this.openFeedBackLoop("You have an order that is being processed");
        }else if (orderPlacedResp=="success"){

          const msgType = 'placedOrder';
          const orderDeatils: any = {
            orderId,
            userId,
            customerName:this.dataService.userData.userName,
            cartDetails:JSON.stringify(cartDetails)
          };
          this.dWebSockets.wsSendMsg(msgType,orderDeatils);
          
          this.openFeedBackLoop("Order Placed successfully please wait while we process your payment.We will notify you when it's complete.");

          const prodTiles: any= this.eleRef.nativeElement.querySelectorAll('.cartProdItemHolder');
          const prodTilesHolder: any = this.eleRef.nativeElement.querySelector('.cPBProductTileHolder');

          prodTiles.forEach((prodTile: any) => {
            this.renderer.removeChild(
              prodTilesHolder,prodTile
            );
          });

          this.totalPrice=0;
          this.totalProductsNumb=0;
          this.dataService.cartProductsDetails={};
          this.dataService.cartProductsArray=[];


          //mpesa simulation
          const mpesaDammy: FormData= new FormData();
          mpesaDammy.append('totalValue',cartDetails.totalBill);
          this.backComms.backendCommunicator(
            mpesaDammy,'post',`${this.backComms.backendBaseLink}/mPesaConfirmation`).then((resp: any)=>{
              if( resp ==='complete'){
                const mpesacompleteDammy: FormData = new FormData();
                mpesacompleteDammy.append('paidValue',cartDetails.totalBill);
                mpesacompleteDammy.append('confirmationCode','2CL2WUS1FRK8');
                this.backComms.backendCommunicator(mpesacompleteDammy,
                  'post',`${this.backComms.backendBaseLink}/completeMPesaPayment`).then(()=>{
                  });
              }
            });
        }

      });
  }

  getPayingContact(): string{
    let payingContactToSend='';
    const payingContact: string=this.eleRef.nativeElement.querySelector('#payingContact').value;
    const typeOfContact: string=this.checkContact(payingContact);
    if(typeOfContact!=='phone'){
      payingContactToSend='';
    }else{
      payingContactToSend=payingContact;
    }
    return payingContactToSend;
  }

  checkContact(contact: string): string{
    let typeOfContact='';
    const phoneexpression = /^[(]?[1-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(contact.match(phoneexpression)){
          typeOfContact='phone';
        }else if(contact.match(mailformat)){
            typeOfContact='email';
        }else{
          typeOfContact='undetermined';
        }
    return typeOfContact;
  }

  closeFeedbackLoop(): void{
    const fBLoop: any=this.eleRef.nativeElement.querySelector('.sWFLMain');
    this.renderer.addClass(fBLoop,'nosite');
  }
  openFeedBackLoop(textToDisplay: string): void{
    this.displayText=textToDisplay;
    const fBLoop: any=this.eleRef.nativeElement.querySelector('.sWFLMain');
    this.renderer.removeClass(fBLoop,'nosite');
  }
}
