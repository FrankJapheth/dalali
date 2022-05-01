import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DalaliCachesService {

  public storedLinks: Array<any>=[];
  public cacheName: string = '';

  constructor() { }

  cacheInit (): Promise<any> {

    return new Promise ((chacheNameRes: any, cacheInitError: any) => {
    
      const rawCacheVersion = localStorage.getItem('dalaliChachesVersion');
      let cacheVersion: number = 0;
      const cacheName: string = 'dalaliCaches-v-';
  
      if ( rawCacheVersion === null) {
        const cachesFullName: string = cacheName + cacheVersion;
        localStorage.setItem('dalaliChachesVersion',JSON.stringify(cacheVersion));
        chacheNameRes(cachesFullName);
      }else{
        cacheVersion = JSON.parse(rawCacheVersion);
        const cacheAvailable: any = 'caches' in self
        if (cacheAvailable){
          const oldCachesFullName: string = cacheName + cacheVersion;
          console.log(oldCachesFullName);
          
          caches.delete(oldCachesFullName);
          cacheVersion+=1;
          const newCachesFullName: string = cacheName + cacheVersion;
          console.log(newCachesFullName);
          
          caches.open(newCachesFullName).then(() => {
            
            localStorage.setItem('dalaliChachesVersion',JSON.stringify(cacheVersion));
            chacheNameRes(newCachesFullName);
          })
  
        };
      }

    });
  }

  putContent (cachesName: any,requestLink: any,responseData: any): Promise <any> {
    return new Promise((contentRes: any, contentRej: any)=>{
      const cacheAvailable: any = 'caches' in self
      const cachesNotSupportedErrorCode: number = 0;
      if (cacheAvailable){
        const jsonResponse: Response = this.createJsonResp(responseData)
        caches.open(cachesName).then((currentCaches: any)=>{
          currentCaches.put(requestLink,jsonResponse)          
          contentRes(currentCaches);
        });
      }else{
        contentRej( cachesNotSupportedErrorCode );
      };
    });
  }

  createJsonResp(responseData: any): Response {
    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const jsonResponse = new Response(JSON.stringify(responseData), options);

    return jsonResponse
  }

  getCacheResponse ( cachesName: any, requestLink: any ): Promise<any> {

    return new Promise ((cacheResp:any, cacheRej: any) => {
      const cacheAvailable: any = 'caches' in self
      const cachesNotSupportedErrorCode: number = 0;
      if (cacheAvailable){
        caches.open(cachesName).then((currentCaches: any)=>{
          currentCaches.match(requestLink).then((cacheResponse: any) => {
            cacheResponse.json().then((responseData: any) => {
              cacheResp(responseData);
            });
            
          });
        });

      }else{
        cacheRej(cachesNotSupportedErrorCode);
      }

    });

  }
  storeLinkToCache(link: any): string {
    const rawDalaliCacheSession: any = sessionStorage.getItem('dalaliSessionCache');   
    if ( rawDalaliCacheSession !== null){
      this.storedLinks = JSON.parse(rawDalaliCacheSession)
      if(this.storedLinks.includes(link)){
        return 'present'
      }else{
        this.storedLinks.push(link)
        sessionStorage.setItem('dalaliSessionCache',JSON.stringify(this.storedLinks));
        return 'store'
      }
    }else{
      this.storedLinks.push(link)
      sessionStorage.setItem('dalaliSessionCache',JSON.stringify(this.storedLinks));
      return 'store'
    }
  };
}
