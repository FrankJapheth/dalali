import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { DalaliCachesService } from '../dalali-caches.service';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  private windowHeight:number=window.innerHeight
  constructor(
    private dalaliData:DalalidataService,
    private elRef:ElementRef,
    private renderer:Renderer2,
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
  ngAfterViewInit(){
    if(this.dalaliData.getUserDOB()=="not set"){
      this.renderer.setStyle(this.elRef.nativeElement.querySelector('.ageLimiter'),'height',`${this.windowHeight}px`)
      this.renderer.removeClass(this.elRef.nativeElement.querySelector('.ageLimiter'),'nosite')
    }
  }
  ngAfterViewChecked():void{ 
    if(this.dalaliData.getUserDOB()=="not set"){
      this.renderer.setStyle(this.elRef.nativeElement.querySelector('.ageLimiter'),'height',`${this.windowHeight}px`)
      this.renderer.removeClass(this.elRef.nativeElement.querySelector('.ageLimiter'),'nosite')
    }else{
      this.renderer.setStyle(this.elRef.nativeElement.querySelector('.ageLimiter'),'height',`${this.windowHeight}px`)
      this.renderer.addClass(this.elRef.nativeElement.querySelector('.ageLimiter'),'nosite')      
    }

  }
  getProductCat():void{
    this.dalaliData.getProductCategories().then(resp=>{
      this.prodCats=resp  
    })
  }

}
