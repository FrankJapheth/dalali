import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';
import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  constructor(
    private dataServices:DalalidataService,
    private backendComms:BackendcommunicatorService,
    public eleRef:ElementRef,
    public renderer:Renderer2
  ) { }
  
  public searchTearm:string=this.dataServices.searchTerm
  public productSearchReasults:Array<any>=this.dataServices.prodSearchResult
  public searchedProductIds:Array<any> = []
  public baseLink:string=this.backendComms.backendBaseLink
  public maxSearchProdIndex:any = {}
  public displayText:string="Display text"
  ngOnInit(): void {
  }

  ngAfterViewInit():void{

    this.dataServices.getMaxProdIndex().then((resp)=>{
      this.maxSearchProdIndex=resp
    })

    this.bodyScroll()

    this.productSearchReasults.forEach((prodSearReselement:any) => {

      this.searchedProductIds.push(prodSearReselement.id)

    });

  }

  productSearchScroll():void{
      let searchForm:FormData=new FormData()
      searchForm.append("prodIdentity",this.searchTearm)
      searchForm.append("maxProdIndex",JSON.stringify(this.maxSearchProdIndex))
      this.backendComms.backendCommunicator(searchForm,"post",`${this.backendComms.backendBaseLink}/searchProds`).then((resp:any)=>{
        if(resp.length>0){

          for (const searchResult of resp) {
            if (!this.searchedProductIds.includes(searchResult.id)){

              searchResult.inCart=false
              this.productSearchReasults.push(searchResult)
              this.searchedProductIds.push(searchResult.id)
              
            }

          }
          this.storeFetchedProdDetails(resp)
        }
      })
  }

  storeFetchedProdDetails(fetchedDetails:any):void{
    for (let prodDet = 0; prodDet < fetchedDetails.length; prodDet++) {
      const prodDetEle = fetchedDetails[prodDet];
      let siteProd:any=this.dataServices.getSiteProd(prodDetEle.id)
      if(siteProd==undefined){
        this.dataServices.addSiteProd(prodDetEle.id,prodDetEle) 
      }    
    }   
  }

  bodyScroll():void{
    window.addEventListener("scroll",()=>{    
      var scrollable = document.documentElement.offsetHeight- (Math.ceil(window.innerHeight*1.5));
      var scrolled = window.scrollY;
      if (Math.ceil(scrolled)>=scrollable) {
        this.productSearchScroll()
      }  
  })
  }
}
