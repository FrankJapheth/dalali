import { Injectable } from '@angular/core';
import { DalalidataService } from '../data/dalalidata.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DalaliWebSocketsService {

  constructor(
    private dataService:DalalidataService,
    private dRoute:Router
  ) { }
  public dalaliSockets:any=null
  public hostName='127.0.0.1:8000'
  public wsBackendBaseLink:string=`ws://${this.hostName}`
  public websocketOpen:boolean=false

  wsBackEndCommunicator(userContact:string,userName:string,userType:string):void{
    
    this.dalaliSockets = new WebSocket(`${this.wsBackendBaseLink}/ws/orders?contact=${userContact}&name=${userName}&userType=${userType}`);
  
    
    this.dalaliSockets.onopen = () => {

      this.websocketOpen=true    
          
      
    };
    
    this.dalaliSockets.onclose = () => {
  
      this.websocketOpen=false
      console.error('Chat socket closed unexpectedly');

    };
    
    this.dalaliSockets.onmessage = (event:any) => {

        const data = JSON.parse(event.data);

        const msgObject:any = JSON.parse(data.message)
        console.log(msgObject);
        if(msgObject.message.length>1){
          
          if (msgObject.message[0] == "orderComplete"){
            const orderDetails: any =msgObject.message[1]
            this.setOrder(orderDetails)
            const msg_type:string = "customerOrder"
            this.wsSendMsg(msg_type,orderDetails)
          }else if(msgObject.message[0]=="customerOrder"){
            console.log(msgObject.message);
          }

          // const productsData=JSON.parse(data.message[0]);

          // productsData.forEach((productData:any) => {
          //   let prodId:string=productData.prodId
          //   let prodQuantity:number=productData.prodQuantity
          //   this.dataService.getSiteProd(prodId)[3]=prodQuantity          
          // });       

        }else{

          const productsData=JSON.parse(data.message[0]);

          productsData.forEach((productData:any) => {
            let prodId:string=productData.prodId
            let prodQuantity:number=productData.prodQuantity
            this.dataService.getSiteProd(prodId)[3]=prodQuantity          
          });
        }
        
    };
  }

  wsSendMsg(message:string,orderDetails:string):boolean{
    let msgSent:boolean=false

    if(this.dalaliSockets!==null && this.websocketOpen===true){

      this.dalaliSockets.send(JSON.stringify({
        'message': [message,orderDetails]
      }));

      msgSent=true

    }

    return msgSent
  }

  setOrder(orderDetails: any):void {

    const rawPendingOrders: any = localStorage.getItem('cartIds');
    const pendingOrders: Array<any> = JSON.parse(rawPendingOrders);
    for (const pendingOrder of pendingOrders){
      if (pendingOrder.orderId == orderDetails.orderId){
        pendingOrders.splice(pendingOrders.indexOf(pendingOrder),1);
      }
    }
    localStorage.setItem('cartIds',JSON.stringify(pendingOrders));

    const rawSuccessfulOrders: any = localStorage.getItem('successfulOrders');
    if(rawSuccessfulOrders == null){
      const successfulOrders: Array<any> = [{orderId:orderDetails.orderId,totalBill:orderDetails.totalBill}];
      localStorage.setItem('successfulOrders',JSON.stringify(successfulOrders));
    }else{
      const successfulOrders: Array<any> = JSON.parse(rawSuccessfulOrders);
      successfulOrders.push({orderId:orderDetails.orderId,totalBill:orderDetails.totalBill});
      localStorage.setItem('successfulOrders',JSON.stringify(successfulOrders));
    }
  }

}
