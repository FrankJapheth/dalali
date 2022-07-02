import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendcommunicatorService {
  public hostName: string='127.0.0.1:8000'
  public backendBaseLink:string=`http://${this.hostName}`
  constructor( ) { }

  backendCommunicator(msgBody:FormData,method:string,link:string):Promise< string>{
    return new Promise((searchResolve,searchReject)=>{
        const searchXhr=new XMLHttpRequest();
        searchXhr.open(method,link)
        searchXhr.onreadystatechange=()=>{
            if(searchXhr.status==200 && searchXhr.readyState==4){
              let secondResponseFilter:string=JSON.parse(searchXhr.response)["backendResponse"];
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
