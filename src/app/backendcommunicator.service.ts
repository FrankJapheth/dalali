import { Injectable } from '@angular/core';
import { DalaliCachesService } from './dalali-caches.service';

@Injectable({
  providedIn: 'root'
})
export class BackendcommunicatorService {
  public hostName: string='dalaliwinehouse.com/backend'
  public backendBaseLink:string=`https://${this.hostName}`
  constructor(
    private dalaliCaches:DalaliCachesService
  ) { }

  backendCommunicator(msgBody:FormData,method:string,link:string):Promise< string>{
    return new Promise((searchResolve,searchReject)=>{
        const searchXhr=new XMLHttpRequest();
        searchXhr.open(method,link)
        searchXhr.onreadystatechange=()=>{
            if(searchXhr.status==200 && searchXhr.readyState==4){               
              let firtResponseFilter: any=JSON.parse(searchXhr.response);
              let secondResponseFilter:string=JSON.parse(firtResponseFilter)["backendResponse"];
              const dalaliSession: any = sessionStorage.getItem('dalaliSessionCache');
              if(dalaliSession === null){
                console.log('empty cache');
                
              }
              
              const cartId: any =msgBody.get('categoryProductId');
              if (cartId !== null){
                let storageFlag:string = this.dalaliCaches.storeLinkToCache(link+cartId);
                
              }else{
                let storageFlag:string = this.dalaliCaches.storeLinkToCache(link);
              }
              searchResolve(secondResponseFilter)
            }
            searchXhr.onerror=evt=>{
                searchReject(evt)
            }
        }
        searchXhr.send(msgBody)
    })
  }


}
