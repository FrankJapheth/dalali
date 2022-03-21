import { Injectable} from '@angular/core';
import { BackendcommunicatorService } from './backendcommunicator.service';

@Injectable({
  providedIn: 'root'
})
export class DalalidataService {

  constructor(
    private backendCommunicator:BackendcommunicatorService,
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
  public siteProds:any={}
  public adminColumnsToEdit:Array<any>=[
    "barcode","name","metrics","quantity","Price","Discounts","ImgUrl"
  ]
  public retailerColumnToEdit:Array<any>=[
    "name","metrics","quantity","ImgUrl"
  ]

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
      this.backendCommunicator.backendCommunicator(new FormData,"get",
      `${this.backendCommunicator.backendBaseLink}/catProducts`).then(resp=>{
        catResp(resp)
      }).catch(err=>{
        catRej(err)
      })

    })
  }
  addProdToCart(prodId:string,prodDetails:Array<any>,numbOrdered:any):boolean{
    let productAdded:boolean=false
    let productPresent:boolean=this.cartProductsArray.includes(prodId)
    if(productPresent==false){
      this.cartProductsArray.push(prodId)
      this.cartProductsDetails[`${prodId}`]=[prodDetails,numbOrdered]
      productAdded=true
    }else{
      this.cartProductsArray.splice(this.cartProductsArray.indexOf(prodId),1)
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
      this.cartProductsArray.splice(this.cartProductsArray.indexOf(prodId))
      delete this.cartProductsDetails[`${prodId}`]
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
    if(type=="add"){
      newValue=currentValue+numberToIncreaseBy
      this.cartProductsDetails[prodId][1]=newValue
      newTotal=this.getTotalCartProductsPrice()
      newTotalProds=this.getTotalNuberOfProducts()
    }else if(type=="sabtruct"){
      newValue=currentValue-numberToIncreaseBy
      this.cartProductsDetails[prodId][1]=newValue
      newTotal=this.getTotalCartProductsPrice()
      newTotalProds=this.getTotalNuberOfProducts()
    }
    return [newValue,newTotal,newTotalProds]
  }
  clearCartProd(){
    this.cartProductsArray=[]
    this.cartProductsDetails={}
  }
  addSiteProd(prodId:string,prodDetails:Array<any>):void{
    this.siteProds[prodId]=prodDetails
  }
  getSiteProd(prodId:string):any{
    return this.siteProds[prodId]
  }
  getSiteProds():any{
    return this.siteProds
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
