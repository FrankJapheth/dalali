import { Component, OnInit, ElementRef, Renderer2, AfterViewInit, ViewChild } from '@angular/core';

import { DalalidataService } from '../service/data/dalalidata.service';
import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';
import { DalaliWebSocketsService } from '../service/webSocket/dalali-web-sockets.service';
import { SingleWayFeedbackLoopComponent } from '../single-way-feedback-loop/single-way-feedback-loop.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit,AfterViewInit {
  
  @ViewChild(SingleWayFeedbackLoopComponent) singleLoop!:SingleWayFeedbackLoopComponent;

  public cartProds: any=this.dataService.getCartProds();
  public cartProdsIds: any=this.cartProds;
  public cartProdsArray: Array<any>=[];
  public cartProdsDetails: any=this.dataService.getSiteProds();
  public baseLink: string=this.backComms.backendBaseLink;
  public totalPrice: number=0;
  public totalProductsNumb: number=0;
  public currentDate: any=0;
  public paymentMethods: any=[];
  public userName: any=null;
  public displayText: string='Display text';
  public orderPayingContact: string = '';
  private userId: string=this.dataService.userData.userContact;
  public calcHeight: number = window.innerHeight-70
  private payingContact:string=''
  private paymentMethodId:string = ''

  constructor(
    private dataService: DalalidataService,
    private backComms: BackendcommunicatorService,
    private eleRef: ElementRef,
    private renderer: Renderer2,
    private dWebSockets: DalaliWebSocketsService
  ) { }

  ngOnInit(): void {
    this.getProdsArray()
  }

  ngAfterViewInit(): void{
    this.renderer.setStyle(this.eleRef.nativeElement.querySelector('.cartPage'),'height',this.calcHeight+'px')
    
  }

  getProdsArray(): void{

    this.userName=this.dataService.userData.userName;
    this.totalPrice=this.dataService.getTotalCartProductsPrice();
    this.totalProductsNumb=this.dataService.getTotalNumberOfProducts();

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
    this.paymentMethodId =  lItem.id.slice(4);
    
    pDTPMVString.innerText=lItemValue;
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

      this.dataService.singlewayfLoopMsg=` The quantity of the products you are requesting is more than the number in stock  `

      this.singleLoop.openFeedbackLoop()
    }
  }

  prodNumbInput(evt: any){

    const valueToset: any=evt.target.value;
    const eleId: any=evt.target.id.slice(9);
    const productDetails: any=this.dataService.getSiteProd(eleId);
    const productQauntity=Number(productDetails.maxQuantity);

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

          this.dataService.singlewayfLoopMsg=` The quantity of the products you are requesting is more than the number in stock  `
    
          this.singleLoop.openFeedbackLoop()

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

  getPayingContact(): void{

    let payingContactToSend='';
    const payingContact: string=this.eleRef.nativeElement.querySelector('#payingContact').value;
    const typeOfContact: string=this.checkContact(payingContact);

    if(typeOfContact!=='phone'){

      this.dataService.singlewayfLoopMsg=` Lipa na mpesa only accepts phone number as the transaction account identifier.  `

      this.singleLoop.openFeedbackLoop()

    }else{

      const phoneNumberFormat:any = payingContact.slice(0,2)
      if (phoneNumberFormat == '07'){

        payingContactToSend='2547'+payingContact.slice(2)

        this.placeOrder()
        
      }else{
        
        payingContactToSend=payingContact
        this.placeOrder()

      }
    }

    this.payingContact=payingContactToSend

  }

  checkContact(contact: string): string{
    let typeOfContact='';
    const phoneexpression = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
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

          this.closeCheckout()

        }else{
        
          this.dataService.singlewayfLoopMsg=` You can\'t place an order that amounts to 0 shillings. `
    
          this.singleLoop.openFeedbackLoop()

        }

      }else{

        this.dataService.singlewayfLoopMsg=` You can\'t purchase something unless you have an account. `
  
        this.singleLoop.openFeedbackLoop()

      }

    }else{

      this.dataService.singlewayfLoopMsg=` We support M-Pesa for now. `

      this.singleLoop.openFeedbackLoop()

    }
  }

  placeOrder():void{

    const prodsToSend:Array<any> = this.getProdsToSendArray()
    
    const orderForm:FormData = new FormData()

    orderForm.append('orderedProds',JSON.stringify(prodsToSend))
    orderForm.append('userId',this.userId)
    orderForm.append('catId',this.dataService.currentCartId)
    orderForm.append('userType',this.dataService.userData.userType)

    this.backComms.backendCommunicator(orderForm,"POST",`${this.baseLink}/placeOrders`).then((resp:any)=>{

      this.closingPayingWithMpesaPrompt()

      if ( resp.status == 0){

        this.dataService.getDbCart(this.dataService.currentCartId).then((dbCart:any)=>{

          dbCart.cartState = 'order'
          dbCart.cartOrderId = this.dataService.currentCartId

          this.dataService.updateDbCart(dbCart).then(()=>{

          }).catch((err:any)=>{

            console.error(err);
            
          })

        }).catch((err:any)=>{

          console.error(err);
          
        })

        this.dataService.singlewayfLoopMsg=` Order placed successfuly. 
        Close this prompt to initalize payment`
  
        this.singleLoop.openFeedbackLoop().then(()=>{

          this.initPayment(resp.totalPrice)

        })

      }else if ( resp.status == 1){

        this.dataService.singlewayfLoopMsg = resp.comment
  
        this.singleLoop.openFeedbackLoop()

      }
      
    })

  }

  getProdsToSendArray():Array<any>{

    const prodsToSend:Array<any> = []

    for (const cartProd of this.cartProdsArray) {

      const prodDetails:any = {
        'id':cartProd.id,
        'quantityOrdered':cartProd.quantityOrdered
      }

      prodsToSend.push(prodDetails)
      
    }

    return prodsToSend

  }

  openCheckout():void{

    const payoutDiv: any = this.eleRef.nativeElement.querySelector(".payoutDiv")
    const pDTile:any = this.eleRef.nativeElement.querySelector(".pDTile")

    this.renderer.removeClass(payoutDiv,"nosite")

    setTimeout(() => {

      this.renderer.setStyle(pDTile,'width','50%')
      this.renderer.setStyle(pDTile,'height','95%')
      
    }, 100);

  }

  closeCheckout():void{

    const payoutDiv: any = this.eleRef.nativeElement.querySelector(".payoutDiv")
    const pDTile:any = this.eleRef.nativeElement.querySelector(".pDTile")

    this.renderer.setStyle(pDTile,'width','0px')
    this.renderer.setStyle(pDTile,'height','0px')

    setTimeout(() => {

      this.renderer.addClass(payoutDiv,"nosite")
      
    }, 200);

  }

  initPayment(total_bill:string):void{

    const paymentForm:FormData=new FormData()
    paymentForm.append("payingContact",this.payingContact)
    paymentForm.append("totalBill",total_bill)
    paymentForm.append("userId", this.userId)
    paymentForm.append('paymentType',this.paymentMethodId)

    if (this.dWebSockets.websocketOpen == true){

      const msgBody:any={
        "payingContact":this.payingContact
      }

      this.dWebSockets.wsSendMsg('placedOrder',msgBody)

    }

    this.backComms.backendCommunicator(paymentForm,'POST',`${this.backComms.backendBaseLink}/initPayments`).then((resp:any)=>{

      if (Number(resp.status) == 0){

        this.dataService.singlewayfLoopMsg=` We have sent a payment prompt to 
        the phone containing the contact submited. Please please put your passcode then submit
        to complete your payment.`

        this.dataService.paymentId=resp.paymentId

        this.singleLoop.openFeedbackLoop().then(()=>{
          this.simulateConfirmPayment(resp.MerchantRequestID,this.payingContact)
        })

      }

    })

  }

  simulateConfirmPayment(paymentId:string,phoneNumber:string):void{

    const simulationForm:FormData = new FormData()

    simulationForm.append("MerchantRequestID",paymentId)
    simulationForm.append("PhoneNumber",phoneNumber.slice(3))

    this.backComms.backendCommunicator(simulationForm,"POST",`${this.backComms.backendBaseLink}/confirmMpesaPayment`)

  }

}
