import { Component, OnInit } from '@angular/core';
import { DalaliSessionStorageService } from '../service/sessions/dalali-session-storage.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(
    private sessionDetails: DalaliSessionStorageService
    ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit():void{
    const deviceTypeDetails: Array< any >=this.getDeviceType();
    const webDeviceId: string = deviceTypeDetails[0]+' '+deviceTypeDetails[1]+' '+this.fnBrowserDetect()+' '+this.browserName();
    this.sessionDetails.webDeviceId= webDeviceId;
  }

  getDeviceType(): any{
    const ua = navigator.userAgent;
    const browserDetails: any ={

    }
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return ["tablet", ua];
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return ["mobile",ua];
    }
    return ["desktop",ua];
  };
  fnBrowserDetect(): string{
                  
    let userAgent = navigator.userAgent;
    let browserName: any = null;
    
    if(userAgent.match(/chrome|chromium|crios/i)){
        browserName = "chrome";
      }else if(userAgent.match(/firefox|fxios/i)){
        browserName = "firefox";
      }  else if(userAgent.match(/safari/i)){
        browserName = "safari";
      }else if(userAgent.match(/opr\//i)){
        browserName = "opera";
      } else if(userAgent.match(/edg/i)){
        browserName = "edge";
      }else{
        browserName="No browser detection";
      }
      return browserName         
  }

  browserName (): any {
        return (
          function (agent) {        
              switch (true) {
                case agent.indexOf("edge") > -1: return "MS Edge";
                case agent.indexOf("edg/") > -1: return "Edge ( chromium based)";
                case agent.indexOf("opr") > -1 && !!window.opr: return "Opera";
                case agent.indexOf("chrome") > -1 && !!window.chrome: return "Chrome";
                case agent.indexOf("trident") > -1: return "MS IE";
                case agent.indexOf("firefox") > -1: return "Mozilla Firefox";
                case agent.indexOf("safari") > -1: return "Safari";
                default: return "other";
              }
          }
        )(
          window.navigator.userAgent.toLowerCase()
          );
  }
  
}
