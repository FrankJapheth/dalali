import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendcommunicatorService {
  public hostName: string='dalaliwinehouse.com/backend'
  public backendBaseLink:string=`https://${this.hostName}`
  constructor( ) { }

  backendCommunicator(msgBody:FormData,method:string,link:string):Promise< string>{
    return new Promise((searchResolve,searchReject)=>{
        const searchXhr=new XMLHttpRequest();
        searchXhr.open(method,link)
        searchXhr.onreadystatechange=()=>{
            if(searchXhr.status==200 && searchXhr.readyState==4){               
              let firtResponseFilter: any=JSON.parse(searchXhr.response);
              let secondResponseFilter:string=JSON.parse(firtResponseFilter)["backendResponse"];
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
