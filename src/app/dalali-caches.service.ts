import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DalaliCachesService {

  public storedLinks: Array<any>=[];

  constructor() { }

  putContent (): Promise <any> {
    return new Promise((contentRes: any, contentRej: any)=>{
      const cacheAvailable: any = 'caches' in self
      const cachesNotSupportedErrorCode: number = 0;
      const cacheName: string = 'dalaliCaches-v-';
      if (cacheAvailable){
        const rawCacheVersion = localStorage.getItem('dalaliChachesVersion')
        if (rawCacheVersion !== null){
          const cacheVersion: number = JSON.parse(rawCacheVersion);
          localStorage.setItem('dalaliChachesVersion',JSON.stringify(cacheVersion+1))
          const oldCachesFullName: string = cacheName + cacheVersion;
          const newCachesFullName: string = cacheName + (cacheVersion+1);
          caches.delete(oldCachesFullName);
          caches.open(newCachesFullName).then((newCaches: any)=>{
            console.log(newCaches);
            
          });
        }else{
          const cacheVersion: number = 0;
          const cachesFullName: string = cacheName + cacheVersion;
          caches.open(cachesFullName).then((dalaliCaches: any)=>{
            console.log(dalaliCaches);

          });

        };
      }else{
        contentRej( cachesNotSupportedErrorCode )
      };
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
