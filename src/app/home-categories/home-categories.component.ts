import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';
import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';
import { DalaliCachesService } from '../service/caches/dalali-caches.service';

@Component({
  selector: 'app-home-categories',
  templateUrl: './home-categories.component.html',
  styleUrls: ['./home-categories.component.scss']
})
export class HomeCategoriesComponent implements OnInit {

  constructor(
    private eleRef:ElementRef,
    private renderer:Renderer2,
    private dataServices:DalalidataService,
    private backEndComms:BackendcommunicatorService,
    private dalaliCache: DalaliCachesService
  ) { }
  
  public bEBaseLink=this.backEndComms.backendBaseLink

  @Input() catId:any
  @Input() catName:any
  
  public productCategoriesDetails:any=[]
  public catProdsArray:any=[]
  public displayText:string="Display text"
  public classType:string=""

  ngOnInit(): void {
  }
  ngAfterViewInit():void{

    this.getCategoryProducts().then((resp:any)=>{

      if(resp.length>0){

        const catProdsIds:Array<any>=[]
        const newProds:Array<any>=[]
        const existingProds:Array<any>=[]
        let catProds:Array<any>=[]
        let siteProds:any = this.dataServices.getSiteProds()
        

        for (const catProd of resp) {

          catProdsIds.push(catProd.id)
          
        }

        for (const catProdId of catProdsIds) {

          if(Object.keys(siteProds).includes(catProdId)){

            existingProds.push(siteProds[catProdId])

          }else{

            newProds.push(resp[catProdsIds.indexOf(catProdId)])

          }
          
        }
        
        this.storeFetchedProdDetails(newProds)
        
        catProds=newProds.concat(existingProds)

        this.catProdsArray=catProds

      }else{
        let categoryContainer:any=this.eleRef.nativeElement.querySelector(".categoryDiv")
        this.renderer.addClass(categoryContainer,"nosite")
      }

    })

  }

  getCategoryProducts():Promise<string>{  
    return new Promise((res:any)=>{
      const cacheRequestLink: string = `${this.backEndComms.backendBaseLink}/getCatProds${this.catId}`;
      const sessionCacheName: string = this.dalaliCache.cacheName;
      const rawDalaliSessionCache: any =sessionStorage.getItem('dalaliSessionCache')
      const dalaliSessionCache: any =JSON.parse(rawDalaliSessionCache)
      if ( dalaliSessionCache !== null ){
        if(!dalaliSessionCache.includes(cacheRequestLink)){
          const requestLink: string = `${this.backEndComms.backendBaseLink}/getCatProds`;
          let catProdFormData:FormData=new FormData()
          catProdFormData.append("categoryProductId",this.catId)
          this.backEndComms.backendCommunicator(catProdFormData,"post",requestLink).then(resp=>{
            const responseData: any = resp
            this.dalaliCache.storeLinkToCache(cacheRequestLink);
            this.dalaliCache.putContent(sessionCacheName,cacheRequestLink,responseData).then(() => {
              res(resp)
            });
          });
        }else{
          this.dalaliCache.getCacheResponse(sessionCacheName,cacheRequestLink).then((cacheResp: any) => {            
            res(cacheResp)
          });
        }
      }else{
        const requestLink: string = `${this.backEndComms.backendBaseLink}/getCatProds`;
        let catProdFormData:FormData=new FormData()
        catProdFormData.append("categoryProductId",this.catId)
        this.backEndComms.backendCommunicator(catProdFormData,"post",requestLink).then(resp=>{
          const responseData: any = resp
          this.dalaliCache.storeLinkToCache(cacheRequestLink);
          this.dalaliCache.putContent(sessionCacheName,cacheRequestLink,responseData).then(() => {
            res(resp)
          });
        });
      }
    })
  }

  storeFetchedProdDetails(prodsDetails:any):void{

    for (const prodDetails of prodsDetails) {

      let siteProd:any=this.dataServices.getSiteProd(prodDetails.id)
      if(siteProd==undefined){
        this.dataServices.addSiteProd(prodDetails.id,prodDetails)
      }
      
    }
  }

  catTitleSeeMore(evt:any):void{
    let docCatTitleSeeMoreId:any=evt.target.id
    let cDTCTNID=`#cDTCTN${docCatTitleSeeMoreId.slice(4)}`
    let cDTCTNEle=this.eleRef.nativeElement.querySelector(cDTCTNID)
    this.dataServices.chosenCategory=cDTCTNEle.innerText
    this.dataServices.chosenCategoryId=docCatTitleSeeMoreId.slice(4)
    let pCTSMID=`#pCTSM${docCatTitleSeeMoreId.slice(4)}`
    let pCTSMEle=this.eleRef.nativeElement.querySelector(pCTSMID)
    pCTSMEle.click()
  }
  
  catTitleName(evt:any):void{
    let doccatTitleNameId:any=evt.target.id
    let cDTCTNID=`#cDTCTN${doccatTitleNameId.slice(9)}`
    let cDTCTNEle=this.eleRef.nativeElement.querySelector(cDTCTNID)
    this.dataServices.chosenCategory=cDTCTNEle.innerText
    this.dataServices.chosenCategoryId=doccatTitleNameId.slice(9)
    let pCTSMID=`#pCTSM${doccatTitleNameId.slice(9)}`
    let pCTSMEle=this.eleRef.nativeElement.querySelector(pCTSMID)
    pCTSMEle.click()
  }

}
