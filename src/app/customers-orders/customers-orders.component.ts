import { AfterViewInit, Component, OnInit, ElementRef,Renderer2 } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';

@Component({
  selector: 'app-customers-orders',
  templateUrl: './customers-orders.component.html',
  styleUrls: ['./customers-orders.component.scss']
})
export class CustomersOrdersComponent implements OnInit,AfterViewInit {

  public docCartIds: any=[];
  public docCustomerCartIds: any=[];
  public cartDetails: any={};
  public userName: string ='';
  public productsDetailsArray: any=[];
  public productsDetails: any={};
  public windowWidth: number = window.innerWidth;
  public section: string = 'user';

  constructor(
    private eleRef: ElementRef,
    private dataServices: DalalidataService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  getPendingCartIds(): void{
    this.section='buyer';
    const rawCartIds = localStorage.getItem('cartIds');
    let cartIdsArray =[];

    if(rawCartIds !== null){
      cartIdsArray = JSON.parse(rawCartIds);
    }

    if(cartIdsArray.length>0){
      this.docCartIds=this.arrayRotate(cartIdsArray,true);
    }
    this.userName=this.dataServices.userData.userName;
    this.openReceiptView();
  }

  getFailedCartIds(): void{
    this.section='buyer';
    const rawCartIds = localStorage.getItem('failedOrders');
    let cartIdsArray =[];

    if(rawCartIds !== null){
      cartIdsArray = JSON.parse(rawCartIds);
    }

    if(cartIdsArray.length>0){
      this.docCartIds=this.arrayRotate(cartIdsArray,true);
    }
    this.userName=this.dataServices.userData.userName;
    this.openReceiptView();
  }

  getSuccessfulCartIds(): void{
    this.section='buyer';
    const rawCartIds = localStorage.getItem('successfulOrders');
    let cartIdsArray =[];

    if(rawCartIds !== null){
      cartIdsArray = JSON.parse(rawCartIds);
    }

    if(cartIdsArray.length>0){
      this.docCartIds=this.arrayRotate(cartIdsArray,true);
    }
    this.userName=this.dataServices.userData.userName;
    this.openReceiptView();
  }

  getUnprocessedCustomerOrders(): void{
    this.section='retailer';
    const rawCartIds = localStorage.getItem('customerOrders');
    let cartIdsArray =[];

    if(rawCartIds !== null){
      cartIdsArray = JSON.parse(rawCartIds);
    }

    if(cartIdsArray.length>0){
      this.docCustomerCartIds=this.arrayRotate(cartIdsArray,true);
    }
    this.userName=this.dataServices.userData.userName;
    this.openReceiptView();
  }

  getProcessedCustomerOrders(): void{
    this.section='retailer';
    const rawCartIds = localStorage.getItem('processedCustomerOrders');
    let cartIdsArray =[];

    if(rawCartIds !== null){
      cartIdsArray = JSON.parse(rawCartIds);
    }

    if(cartIdsArray.length>0){
      this.docCustomerCartIds=this.arrayRotate(cartIdsArray,true);
    }
    this.userName=this.dataServices.userData.userName;
    this.openReceiptView();
  }

  arrayRotate(arr: Array <any>, reverse: boolean) {
    if (reverse){
      arr.unshift(arr.pop());
    }else {
      arr.push(arr.shift());
    };
    return arr;
  }

  getDBOrder(evt: any): void{
    const cartEleId: any= `#pOI${evt.target.id.slice(2)}`;
    const cartId: string=this.eleRef.nativeElement.querySelector(cartEleId).innerText;
    const userDbVersions: any=Number(localStorage.getItem('cartDbVersions'));
    const cartDBRequest: any=window.indexedDB.open('dalaliCart',userDbVersions);
    cartDBRequest.onsuccess = (event: any)=> {
      const db: any = event.target.result;
      this.getData(db,cartId);
    };
  }
  getData(orderDB: any, cartId: string): void{
    const storeName= 'userCart';
    const transaction = orderDB.transaction(storeName, 'readwrite').objectStore(
      storeName
      );
    const objectStoreRequest = transaction.get(` ${cartId} `);
    objectStoreRequest.onsuccess=(evt: any)=>{
      const myRecord = evt.target.result;
      this.cartDetails=myRecord;
      this.productsDetailsArray=Object.keys(JSON.parse(myRecord.productsOrdered));
      this.productsDetails=JSON.parse(myRecord.productsOrdered);
      this.renderer.removeClass(
        this.eleRef.nativeElement.querySelector('.orderView'),'nosite'
      );
      if( this.windowWidth < 800){
        this.renderer.addClass(
          this.eleRef.nativeElement.querySelector('.closecontrolsView'),'nosite'
        );
      }
    };
  }

  getCustomerDBOrder(evt: any): void{
    const cartEleId: any= `#pOI${evt.target.id.slice(2)}`;
    const cartId: string=this.eleRef.nativeElement.querySelector(cartEleId).innerText;
    const userDbVersions: any=Number(localStorage.getItem('cartDbVersions'));
    const cartDBRequest: any=window.indexedDB.open('dalaliCart',userDbVersions);
    cartDBRequest.onsuccess = (event: any)=> {
      const db: any = event.target.result;
      this.getCustomerData(db,cartId);
    };
  }
  getCustomerData(orderDB: any, cartId: string): void{
    const storeName= 'customerOrders';
    const transaction = orderDB.transaction(storeName, 'readwrite').objectStore(
      storeName
      );
    const objectStoreRequest = transaction.get(` ${cartId} `);
    objectStoreRequest.onsuccess=(evt: any)=>{
      const myRecord = evt.target.result;
      this.cartDetails=myRecord;
      this.productsDetailsArray=Object.keys(JSON.parse(myRecord.productsOrdered));
      this.productsDetails=JSON.parse(myRecord.productsOrdered);
      this.renderer.removeClass(
        this.eleRef.nativeElement.querySelector('.orderView'),'nosite'
      );
      if( this.windowWidth < 800){
        this.renderer.addClass(
          this.eleRef.nativeElement.querySelector('.closecontrolsView'),'nosite'
        );
      }
    };
  }
  openReceiptView(): void{
    const oLTPDiv: any = this.eleRef.nativeElement.querySelectorAll('.oLTPDiv');
    if(oLTPDiv!=null){
      oLTPDiv.forEach((oLTPDEle: any) => {
        this.renderer.removeChild(
          this.eleRef.nativeElement.querySelector('.orderLists'),
          oLTPDEle
        );
      });
    }
    const divCOControllers: any = this.eleRef.nativeElement.querySelector('.cOControllers');
    this.renderer.addClass(divCOControllers,'nosite');
    const divCOControls: any = this.eleRef.nativeElement.querySelector('.cOControls');
    this.renderer.removeClass(divCOControls,'nosite');
    this.renderer.addClass(
      this.eleRef.nativeElement.querySelector('.orderView'),'nosite'
    );
  }
  closeReceiptView(): void{
    const divCOControls: any = this.eleRef.nativeElement.querySelector('.cOControls');
    this.renderer.addClass(divCOControls,'nosite');
    const divCOControllers: any = this.eleRef.nativeElement.querySelector('.cOControllers');
    this.renderer.removeClass(divCOControllers,'nosite');
  }
  closeOrderView(): void {
    this.renderer.addClass(
      this.eleRef.nativeElement.querySelector('.orderView'),'nosite'
    );
    if( this.windowWidth < 800){
      this.renderer.removeClass(
        this.eleRef.nativeElement.querySelector('.closecontrolsView'),'nosite'
      );
    }

  }
}

