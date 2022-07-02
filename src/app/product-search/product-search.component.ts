import { Component, OnInit,ElementRef,Renderer2 } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';
import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {

  constructor(
    private dataService:DalalidataService,
    private backendComms:BackendcommunicatorService,
    private eleRef:ElementRef,
    private renderer:Renderer2
  ) { }
  
  public prodSearchResult:any=[]
  public maxProdIndexSet:boolean=false
  public maxProdSearchIndex:string=""

  ngOnInit(): void {
  }
  ngAfterViewInit():void{
    this.searchBtn()
  }
  closeResults(): void{
    const docSearchedProductsHolder:any=this.eleRef.nativeElement.querySelector(".searchedProductsHolder")
    const docProductSearchInput: any = this.eleRef.nativeElement.querySelector("#productSearchInput")
    const docCloseResults: any = this.eleRef.nativeElement.querySelector('.closeResults')
    docProductSearchInput.value=''
    this.renderer.setStyle(docSearchedProductsHolder,"height","0px")
    setTimeout(() => {
      this.renderer.addClass(docSearchedProductsHolder,"nosite")
    }, 200);
    this.renderer.addClass(docCloseResults,'nosite')
  }
  productSearchInput(evt:any):void{
    const docCloseResults: any = this.eleRef.nativeElement.querySelector('.closeResults')
    if(this.maxProdIndexSet==false){
      this.dataService.getMaxProdIndex().then((resp:any)=>{
        this.maxProdIndexSet=true
        this.maxProdSearchIndex=resp
        let searchValue:string=evt.target.value
        let docSearchedProductsHolder:any=this.eleRef.nativeElement.querySelector(".searchedProductsHolder")
        if(searchValue!=""){
          let searchForm:FormData=new FormData()
          searchForm.append("prodIdentity",searchValue)
          searchForm.append("maxProdIndex",this.maxProdSearchIndex)
          this.backendComms.backendCommunicator(searchForm,"post",`${this.backendComms.backendBaseLink}/searchProds`).then(resp=>{
            this.prodSearchResult=resp
            this.renderer.removeClass(docSearchedProductsHolder,"nosite")
            this.renderer.setStyle(docSearchedProductsHolder,"height","auto")
          })
          this.renderer.removeClass(docCloseResults,'nosite')
        }else{
          this.renderer.setStyle(docSearchedProductsHolder,"height","0px")
          setTimeout(() => {
            this.renderer.addClass(docSearchedProductsHolder,"nosite")
          }, 200);
          this.renderer.addClass(docCloseResults,'nosite')
        }
      })
    }else{
      let searchValue:string=evt.target.value
      let docSearchedProductsHolder:any=this.eleRef.nativeElement.querySelector(".searchedProductsHolder")
      if(searchValue!=""){
        let searchForm:FormData=new FormData()
        searchForm.append("prodIdentity",searchValue)
        searchForm.append("maxProdIndex",this.maxProdSearchIndex)
        this.backendComms.backendCommunicator(searchForm,"post",`${this.backendComms.backendBaseLink}/searchProds`).then(resp=>{
          this.prodSearchResult=resp
          this.renderer.removeClass(docSearchedProductsHolder,"nosite")
          this.renderer.setStyle(docSearchedProductsHolder,"height","auto")
        })
        this.renderer.removeClass(docCloseResults,'nosite')
      }else{
        this.renderer.setStyle(docSearchedProductsHolder,"height","0px")
        setTimeout(() => {
          this.renderer.addClass(docSearchedProductsHolder,"nosite")
        }, 200);
        this.renderer.addClass(docCloseResults,'nosite')
      }
    }
  }
  redirectToSearch():void{
    let docProductSearchInput:any=this.eleRef.nativeElement.querySelector(".productSearchInput")
    let docLinkItemSearch:any=this.eleRef.nativeElement.querySelector(".linkItemSearch")
    this.dataService.prodSearchResult=this.prodSearchResult
    if(docProductSearchInput.value!=""){
      this.dataService.searchTerm=docProductSearchInput.value
      docLinkItemSearch.click()
    }
  }
  searchBtn():void{
    let docSearchBtn:any=this.eleRef.nativeElement.querySelector(".searchBtn")
    this.renderer.listen(docSearchBtn,"click",()=>{
      this.redirectToSearch()
    })
  }
  searchPeleteClick(evt:any):void{
    let targetId:string=evt.target.id
    let slicedId:string=targetId.slice(4)
    let redirectTargetId:string="sPNS"+slicedId
    let redirectTargetElement:any=this.eleRef.nativeElement.querySelector(`#${redirectTargetId}`)
    let docProductSearchInput:any=this.eleRef.nativeElement.querySelector(".productSearchInput")
    docProductSearchInput.value=redirectTargetElement.innerText
    this.redirectToSearch()
  }
}
