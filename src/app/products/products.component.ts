import { Component, OnInit } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';
import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public chosenCat:string=""
  public chosenCatId:string=""
  public catProdsArray:Array<any>=[]
  public catProdsIds:Array<any> = []
  public baseLink:any=""
  public maxCartProIndex:string=""
  public displayText:string="Display text"
  constructor(
    private dataServices:DalalidataService,
    private backEndComms:BackendcommunicatorService,
  ) { }
  ngOnInit(): void {
    this.SetCheosenCat()
  }
  ngAfterViewInit(){

    this.dataServices.getMaxProdIndex().then((respMax:any)=>{

      this.maxCartProIndex=respMax   
      this.getCategoryProducts(this.maxCartProIndex).then((resp:any)=>{

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

          for (const catProd of resp) {

            this.catProdsIds.push(catProd.id)
            
          }

        }

        this.bodyScroll()

      })
    })
  }

  SetCheosenCat():void{
    this.chosenCat=this.dataServices.chosenCategory
    this.chosenCatId=this.dataServices.chosenCategoryId
    this.baseLink=this.backEndComms.backendBaseLink
  }
  getCategoryProducts(maxIndex:string):Promise<string>{  
    return new Promise((res:any,rej:any)=>{
      let catProdFormData:FormData=new FormData()
      catProdFormData.append("categoryProductId",this.chosenCatId)
      catProdFormData.append("prodMaxIndex",maxIndex)
      catProdFormData.append("cartName",this.chosenCat)
      this.backEndComms.backendCommunicator(catProdFormData,"post",`${this.backEndComms.backendBaseLink}/getCatProds`).then(resp=>{
        res(resp)
      }).catch((err:any)=>{
        rej(err)
      })
    })
  }

  bodyScroll():void{
    window.addEventListener("scroll",()=>{    
      var scrollable = document.documentElement.offsetHeight- (Math.ceil(window.innerHeight*1.5));
      var scrolled = window.scrollY;
      if (Math.ceil(scrolled)>=scrollable) {
        this.getCategoryProducts(this.maxCartProIndex).then((resp:any)=>{

          if(resp.length>0){

            for (const cartProd of resp) {

              if(!this.catProdsIds.includes(cartProd.id)){

                cartProd.inCart=false

                this.catProdsArray.push(cartProd)
                this.catProdsIds.push(cartProd.id)

              }
              
            }
          }
        }) 
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

}
