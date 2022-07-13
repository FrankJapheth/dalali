import { Component, Input, OnInit,ElementRef,Renderer2, AfterViewInit,ViewChild } from '@angular/core';

import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';
import { DalalidataService } from '../service/data/dalalidata.service';

import { SingleWayFeedbackLoopComponent } from '../single-way-feedback-loop/single-way-feedback-loop.component';

@Component({
  selector: 'app-product-pellete',
  templateUrl: './product-pellete.component.html',
  styleUrls: ['./product-pellete.component.scss']
})
export class ProductPelleteComponent implements OnInit,AfterViewInit {
  @ViewChild(SingleWayFeedbackLoopComponent) singleLoop!:SingleWayFeedbackLoopComponent;

  public displayText:string="Display text"
  
  constructor(
    private backEndComms:BackendcommunicatorService,
    private eleRef:ElementRef,
    private renderer:Renderer2,
    public dataServices:DalalidataService
  ) { }

  public bEBaseLink=this.backEndComms.backendBaseLink

  @Input() productDetails:any

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    
    const proId:string=this.productDetails.id
    let ele:any=this.eleRef.nativeElement.querySelector(`#cPC${proId}`)
    let addBut:any=this.eleRef.nativeElement.querySelector(`#aTCB${proId}`)

    if(ele!=null){

      if(this.dataServices.cartProductsArray.includes(proId)){

        this.renderer.removeClass(ele,"nosite")
        addBut.innerText="REMOVE"
        
      }

    }
    
  }

  addToCartBut(evt:any):void{
    let aTCBId:string=evt.target.id.slice(4)
    let cPCAORNTBId:string=`#cPCAORNTB${aTCBId}`
    let cPCAORNTBIdValue:number=this.eleRef.nativeElement.querySelector(cPCAORNTBId).value

    if (this.dataServices.userData.userContact !== null){

      this.addProdToCart(aTCBId,cPCAORNTBIdValue).then((respProdAddition:any)=>{
        let productInArray:boolean=respProdAddition
        let cPCId:string=`#cPC${aTCBId}`
        let cPCEle:any=this.eleRef.nativeElement.querySelector(cPCId)
        if(productInArray==true){
          this.renderer.removeClass(cPCEle,"nosite")
          evt.target.innerText="REMOVE"
        }else{
          evt.target.innerText="ADD TO CART"
          this.renderer.addClass(cPCEle,"nosite")        
        }
      }).catch((err)=>{
        console.log(err);
      })

    }else{

      this.dataServices.singlewayfLoopMsg = ` Please sign in or sign up first `
      this.singleLoop.openFeedbackLoop()
      
    }
  }

  addProdToCart(prodId:string,numberOfProduct:number):Promise<any>{
    return new Promise((aTCResp,aTCRej)=>{
      try {
        let prodDet:any=this.dataServices.getSiteProd(prodId)
        let productAdded:boolean=this.dataServices.addProdToCart(prodId,prodDet,numberOfProduct)
        aTCResp(productAdded)
      } catch (error) {
        aTCRej(error)
      }
    })
  }

  changeNumberOrdered(prodId:string,numberToIncreaseBy:number,type:string):Array<any>{
    let newValue:Array<any>=this.dataServices.changeCartProdNumb(prodId,numberToIncreaseBy,type)
    return newValue
  }

  cPAORADiv(evt:any):void{
    let eleId:any=evt.target.id.slice(7)
    let newProdVals:Array<any>=this.changeNumberOrdered(eleId,1,"add")
    if(newProdVals[3]==true){
      let cPCAORNTBId:string=`#cPCAORNTB${eleId}`
      let cPCAORNTB:any=this.eleRef.nativeElement.querySelector(cPCAORNTBId)
      cPCAORNTB.value=newProdVals[0]
    }else{
      this.displayText="The quantity of the products you are requesting is more than the number in stock"
    }
  }

  cPCAORBDiv(evt:any):void{
    let eleId:any=evt.target.id.slice(7)
    let newProdVals:Array<any>=this.changeNumberOrdered(eleId,1,"sabtruct")
    if(newProdVals[3]==true){
      let cPCAORNTBId:string=`#cPCAORNTB${eleId}`
      let cPCAORNTB:any=this.eleRef.nativeElement.querySelector(cPCAORNTBId)
      cPCAORNTB.value=newProdVals[0]
    }else{
      let aTCBId:string=`#aTCB${eleId}`
      let cPCId:string=`#cPC${eleId}`
      let cPCEle:any=this.eleRef.nativeElement.querySelector(cPCId)
      this.renderer.addClass(cPCEle,"nosite")
      this.eleRef.nativeElement.querySelector(aTCBId).innerText="ADD TO CART"
    }
  }

  cPCRPBDiv(evt:any):void{
    let cPCRPBDId:string=evt.target.id.slice(6)
    console.log(cPCRPBDId);
    
    let removedCartProddetails:Array<any>=this.dataServices.removeCartProd(cPCRPBDId)
    console.log(removedCartProddetails);
    
    if(removedCartProddetails[2]==true){
      let aTCBId:string=`#aTCB${cPCRPBDId}`
      let cPCId:string=`#cPC${cPCRPBDId}`
      let cPCEle:any=this.eleRef.nativeElement.querySelector(cPCId)
      this.renderer.addClass(cPCEle,"nosite")
      this.eleRef.nativeElement.querySelector(aTCBId).innerText="ADD TO CART"
    }else{
      console.log(removedCartProddetails[2]);
    }
  }

  cPCAORNumbtxtBox(evt:any){
    let valueToset:any=evt.target.value
    if(valueToset!=""){
      if(isNaN(valueToset)==false){
        let eleId:any=evt.target.id.slice(9)
        let productDetails:any=this.dataServices.getSiteProd(eleId)
        let productQauntity:number=Number(productDetails.quantity)
        
        if(valueToset>0){
          this.dataServices.setCartProdNumb(eleId,valueToset)
        }else if(valueToset<=0){
          let cPCRPBDId:string=evt.target.id.slice(9)
          let removedCartProddetails:Array<any>=this.dataServices.removeCartProd(cPCRPBDId)
          if(removedCartProddetails[2]==true){
            let aTCBId:string=`#aTCB${cPCRPBDId}`
            let cPCId:string=`#cPC${cPCRPBDId}`
            let cPCEle:any=this.eleRef.nativeElement.querySelector(cPCId)
            this.renderer.addClass(cPCEle,"nosite")
            this.eleRef.nativeElement.querySelector(aTCBId).innerText="ADD TO CART"
            evt.target.value=1
          }        
        }
        if(valueToset>productQauntity){
          this.dataServices.setCartProdNumb(eleId,productQauntity)
          evt.target.value=productQauntity
          this.displayText="The quantity of the products you are requesting is more than the number in stock"
        }
      }else{
        console.log("only numbers allowed");
        evt.target.value=1
      }
    }
  }

}
