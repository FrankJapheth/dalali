//index 13 is for product in cart

import { Injectable} from '@angular/core';
import { BackendcommunicatorService } from './backendcommunicator.service';
import { DalaliCachesService } from './dalali-caches.service';

@Injectable({
  providedIn: 'root'
})
export class DalalidataService {

  constructor(
    private backendCommunicator:BackendcommunicatorService,
    private dalaliCache: DalaliCachesService
  ) { }

  public userData:any={
    userDob:"not set",
    userContact:null,
    userName:null,
    userType:null
  }
  public typeOfSelectedUserSearch:string=""
  public selectedUsers:Array<string>=[]
  public selectedLinks:Array<string>=[]
  public typeOfRepair:string=""
  public systemRepairTypes:Array<string>=["updating","errorCorrection"]
  public uploadType:string=""
  public holderOffsetTop:number=0
  public productMetrics:Array<string>=["ml","cl","l"]
  public sectionToOpen:string="product"
  public searchTerm:string=""
  public prodSearchResult:any=null
  public chosenCategory:string=""
  public chosenCategoryId:string=""
  public cartProductsArray:Array<any>=[]
  public cartProductsDetails:any={}
  public paymentDetails:any={}
  private siteProds:any={}
  public adminColumnsToEdit:Array<any>=[
    "barcode","name","metrics","quantity","Price","Discounts","ImgUrl"
  ]
  public retailerColumnToEdit:Array<any>=[
    "name","metrics","quantity","ImgUrl"
  ]
  public daysDate:string=''

  public mWFLAns:boolean=false

  setUserBasicInfo(userBasicInfo:Array<string>){
    this.userData.userDob=userBasicInfo[4]
    this.userData.userContact=userBasicInfo[0]
    this.userData.userName=userBasicInfo[1]
    this.userData.userType=userBasicInfo[2]
  }
  getUserBasiInfo():any{
    return this.userData
  }
  getUserDOB():string{
    return this.userData.userDob
  }
  getUsers(userDetails:FormData){
    return new Promise((respResolve,respReject)=>{
      this.backendCommunicator.backendCommunicator(userDetails,"post",
      `${this.backendCommunicator.backendBaseLink}/getUsers`).then(resp=>{
        respResolve(resp)
      }).catch(err=>{
        respReject(err)
      })
    })
  }
  getRoutedLinks(){
    return new Promise((backResp,backRej)=>{
      this.backendCommunicator.backendCommunicator(new FormData,"get",
      `${this.backendCommunicator.backendBaseLink}/getRedirects`).then(resp=>{
        backResp(resp)
      }).catch(err=>{
        backRej(err)
      })
    })
  }
  getProductCategories(){
    return new Promise((catResp,catRej)=>{
      const requestLink: string = `${this.backendCommunicator.backendBaseLink}/catProducts`;
      const sessionCacheName: string = this.dalaliCache.cacheName;
      const rawDalaliSessionCache: any =sessionStorage.getItem('dalaliSessionCache')
      const dalaliSessionCache: any =JSON.parse(rawDalaliSessionCache)
      if ( dalaliSessionCache !== null ){
        if(!dalaliSessionCache.includes(requestLink)){
          this.backendCommunicator.backendCommunicator(new FormData,"get",
          requestLink ).then(resp=>{
            this.dalaliCache.storeLinkToCache(requestLink);
            this.dalaliCache.putContent(sessionCacheName,requestLink,resp).then(() => {
              catResp(resp)
            });
          }).catch(err=>{
            catRej(err)
          })
        }else {

          this.dalaliCache.getCacheResponse(sessionCacheName,requestLink).then((cacheResp: any) => {
            catResp(cacheResp)
          });
        };
      }else {
        this.backendCommunicator.backendCommunicator(new FormData,"get",
        requestLink ).then(resp=>{
          this.dalaliCache.storeLinkToCache(requestLink);
          this.dalaliCache.putContent(sessionCacheName,requestLink,resp).then(() => {
            catResp(resp)
          });
        }).catch(err=>{
          catRej(err)
        })
      };

    })
  }
  addProdToCart(prodId:string,prodDetails:Array<any>,numbOrdered:any=1):boolean{

    let productAdded:boolean=false
    let productPresent:boolean=this.cartProductsArray.includes(prodId)

    if(productPresent==false){

      this.cartProductsArray.push(prodId)

      if(prodDetails.length>13){
        prodDetails[13]=true
      }else{
        prodDetails.push(true)
      }

      this.cartProductsDetails[`${prodId}`]=[prodDetails,numbOrdered]
      this.addSiteProd(prodId,prodDetails)
      productAdded=true
      
    }else{

      if(prodDetails.length>13){
        prodDetails[13]=false
      }

      this.cartProductsArray.splice(this.cartProductsArray.indexOf(prodId),1)
      delete this.cartProductsDetails[`${prodId}`]
      this.addSiteProd(prodId,prodDetails)

      productAdded=false
      
    }

    return productAdded

  }
  getCartProd(prodId:string):any{
    let cartProdDet:any=this.cartProductsDetails[prodId]
    return cartProdDet
  }
  getCartProds():Array<any>{
    let cartProducts:Array<any>=[this.cartProductsArray,this.cartProductsDetails]
    return cartProducts
  }
  removeCartProd(prodId:string):Array<any>{
    let removed=false
    let newTotalNumber:number=0
    let newTotalValue:number=0
    try {
      this.cartProductsArray.splice(this.cartProductsArray.indexOf(prodId),1)
      delete this.cartProductsDetails[`${prodId}`]
      let prodDetails:any=this.getSiteProd(prodId)
      if(prodDetails.length>13){
        prodDetails[13]=false
      }else[
        prodDetails.push(false)
      ]
      this.addSiteProd(prodId,prodDetails)
      newTotalNumber=this.getTotalNuberOfProducts()
      newTotalValue=this.getTotalCartProductsPrice()
      removed=true      
    } catch (error) {
      removed=false
    }
    return [newTotalValue,newTotalNumber,removed]
  }
  removeProdFromCart(prodId:string):boolean{
    let result:boolean=false
    try {
      this.cartProductsArray.splice(this.cartProductsArray.indexOf(prodId),1)
      delete this.cartProductsDetails[prodId]
      result=true
    } catch (error) {
      console.log(error);
      result=false      
    }
    return result
  }
  setCartProdNumb(prodId:string,prodNumb:number):boolean{
    let changed=false
    try {
      this.cartProductsDetails[prodId][1]=prodNumb
      changed=true
    } catch (error) {
      console.log(error);
      changed=false      
    }
    return changed
  }
  changeCartProdNumb(prodId:string,numberToIncreaseBy:number,type:string):Array<any>{
    let currentValue:number=Number(this.cartProductsDetails[prodId][1])
    let newValue:number=0
    let newTotal:number=0
    let newTotalProds:number=0
    let changeDone:boolean=false
    let productDetails:any=this.getSiteProd(prodId)
    let prouctQuant:number=Number(productDetails[3])
    if(type=="add"){
      newValue=currentValue+numberToIncreaseBy
      if(newValue>prouctQuant){
        this.cartProductsDetails[prodId][1]=currentValue
        newTotal=this.getTotalCartProductsPrice()
        newTotalProds=this.getTotalNuberOfProducts()
        changeDone=false
      }else{
        this.cartProductsDetails[prodId][1]=newValue
        newTotal=this.getTotalCartProductsPrice()
        newTotalProds=this.getTotalNuberOfProducts()
        changeDone=true
      }
    }else if(type=="sabtruct"){
      newValue=currentValue-numberToIncreaseBy
      if(newValue>0){
        this.cartProductsDetails[prodId][1]=newValue
        newTotal=this.getTotalCartProductsPrice()
        newTotalProds=this.getTotalNuberOfProducts()
        changeDone=true
      }else {
        this.cartProductsDetails[prodId][1]=1
        let productRemovedDetails:Array<any>=this.removeCartProd(prodId)
        newTotal=productRemovedDetails[0]
        newTotalProds=productRemovedDetails[1]
        changeDone=false
      }
    }
    return [newValue,newTotal,newTotalProds,changeDone]
  }
  clearCartProd(){
    this.cartProductsArray=[]
    this.cartProductsDetails={}
  }
  addSiteProd(prodId:string,prodDetails:Array<any>):void{
    prodDetails.push(false)
    this.siteProds[prodId]=prodDetails
  }
  getSiteProd(prodId:string):any{
    return this.siteProds[prodId]
  }
  getSiteProds():any{
    return this.siteProds
  }
  getSiteProdsList():Array<Array<any>>{
    let siteProdList:Array<Array<any>>=[]
    let listToEdit:Array<any>=Object.keys(this.siteProds)

    for (let index = 0; index < listToEdit.length; index++) {
      const prodArray:any = this.siteProds[listToEdit[index]];
      siteProdList.push(prodArray)      
    }

    return siteProdList
  }

  clearSiteProds(){
    this.siteProds={}
  }
  getTotalCartProductsPrice():number{
    let totalPrice:number=0
    this.cartProductsArray.forEach(cPAElement => {
        let prodPrice:number=Number(this.cartProductsDetails[cPAElement][0][5])
        let numberOfProducts:number=Number(this.cartProductsDetails[cPAElement][1])
        totalPrice+=prodPrice*numberOfProducts
    });
    return totalPrice
  }
  getTotalNuberOfProducts():number{
    let totalProductNumber:number=0
    this.cartProductsArray.forEach(cPAElement => {
        let numberOfProducts:number=Number(this.cartProductsDetails[cPAElement][1])
        totalProductNumber+=numberOfProducts
    });    
    return totalProductNumber
  }
  getPaymentMethods():Promise<any>{
    return new Promise((prodResp:any,prodRej:any)=>{
      let paymentethods:any=null
      this.backendCommunicator.backendCommunicator(new FormData,"get",`${
        this.backendCommunicator.backendBaseLink
      }/getPaymentMethods`).then((resp:any)=>{
        paymentethods=resp; 
        prodResp(paymentethods)
      }).catch((err:any)=>{
        prodRej(err)
      })
    })
  }
  setPaymentDetails(
    totalAmontValue:number,
    numberOfProductsValue:number,
    paymentMethodValue:string,
    dateOrderedValue:string):object{
    this.paymentDetails.totalAmount=totalAmontValue
    this.paymentDetails.numberOfProducts=numberOfProductsValue
    this.paymentDetails.paymentMethod=paymentMethodValue
    this.paymentDetails.dateOrdered=dateOrderedValue
    return this.paymentDetails
  }
  getMaxProdIndex():Promise<any>{
    return new Promise((catResp,catRej)=>{
      this.backendCommunicator.backendCommunicator(new FormData,"get",
      `${this.backendCommunicator.backendBaseLink}/getMaxProdIndex`).then(resp=>{
        catResp(resp)
      }).catch(err=>{
        catRej(err)
      })
    })
  }
  getTableColumnNames(tableName:string):Promise<any>{
    return new Promise((prodColResp:any,prodColRej:any)=>{
      let tableNameFormData:FormData=new FormData()
      tableNameFormData.append("tableName",tableName)
      this.backendCommunicator.backendCommunicator(tableNameFormData,"post",
      `${this.backendCommunicator.backendBaseLink}/getTableColumnNames`).then(resp=>{
        prodColResp(resp)
      }).catch(err=>{
        prodColRej(err)
      })
    })
  }
  getColumnToEdit():Array<string>{
    if(this.userData.userType=="admin"){
      return this.adminColumnsToEdit
    }else if(this.userData.userType=="retailer"){
      return this.retailerColumnToEdit
    }else{
      return ["You are not allowed, sorry"]
    }
  }
}
