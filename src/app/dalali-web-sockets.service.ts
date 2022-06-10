import { Injectable } from '@angular/core';
import { DalalidataService } from './dalalidata.service';

@Injectable({
  providedIn: 'root'
})
export class DalaliWebSocketsService {

  constructor(
    private dataService:DalalidataService
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
        if(data.message.length>1){

          const productsData=JSON.parse(data.message[0]);

          productsData.forEach((productData:any) => {
            let prodId:string=productData.prodId
            let prodQuantity:number=productData.prodQuantity
            this.dataService.getSiteProd(prodId)[3]=prodQuantity          
          });

          const orderDetails=JSON.parse(data.message[1])

          console.log(orderDetails);          

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
}
