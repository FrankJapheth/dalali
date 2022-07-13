import { Component, OnInit } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';
import { DalaliCachesService } from '../service/caches/dalali-caches.service'
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  
  constructor(
    private dalaliData:DalalidataService,
    private dalaliCaches:DalaliCachesService
  ) { }
  public prodCats:any=[]

  ngOnInit(): void {
      const rawDalaliSessionCache: any = sessionStorage.getItem('dalaliSessionCache');
      const dalaliSessionCache: Array<any> = JSON.parse(rawDalaliSessionCache);
      if ( dalaliSessionCache === null){
        this.dalaliCaches.cacheInit().then((cacheName: any) => {
          this.dalaliCaches.cacheName=cacheName;
          sessionStorage.setItem('sessiocCacheName',this.dalaliCaches.cacheName);
          this.getProductCat();
        });
      }else {
        const sessiocCacheName: any=sessionStorage.getItem('sessiocCacheName');
        this.dalaliCaches.cacheName=sessiocCacheName;
        this.getProductCat();
      };
  }

  getProductCat():void{
    this.dalaliData.getProductCategories().then(resp=>{
      this.prodCats=resp  
    })
  }

}
