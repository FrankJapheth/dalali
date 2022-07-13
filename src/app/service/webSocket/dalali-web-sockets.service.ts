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
    
    this.dalaliSockets = new WebSocket(`${this.wsBackendBaseLink}/ws/orders?contact=${userContact}&userType=${userType}`);
  
    
    this.dalaliSockets.onopen = () => {

      this.websocketOpen=true    
          
      
    };
    
    this.dalaliSockets.onclose = () => {
  
      this.websocketOpen=false
      console.error('Chat socket closed unexpectedly');

    };
    
    this.dalaliSockets.onmessage = (event:any) => {

      const data = JSON.parse(event.data);

      const msg:any = JSON.parse(data.message)
      
      const command:string = msg.command
      const msgBody:any = msg.message

      if (command == 'recordSale'){

        this.dataService.recordSale().then((saleResp:boolean)=>{

          if (saleResp == true){

            this.dataService.sendSale()

          }
          
        }).catch((err:any)=>{

          console.error(err);
          
        })

      }else if (command == 'getDeafultSale'){

        this.dataService.getDefaultSales()

      }else if (command == 'newSale'){
          
        this.dataService.addSalesToDb([msgBody])
        
      }

    };
  }

  wsSendMsg(messageCommand:string,message:any):boolean{
    let msgSent:boolean=false

    if(this.dalaliSockets!==null && this.websocketOpen===true){

      this.dalaliSockets.send(JSON.stringify({
        'message': {command:messageCommand,message:message}
      }));

      msgSent=true

    }

    return msgSent
  }

}
