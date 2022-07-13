//index 13 is for product in cart

import { Injectable} from '@angular/core';
import { BackendcommunicatorService } from '../communications/backendcommunicator.service';
import { DalaliCachesService } from '../caches/dalali-caches.service';
import { DalaliIndexDbService } from '../indexedDb/dalali-index-db.service';

@Injectable({
  providedIn: 'root'
})
export class DalalidataService {

  constructor(
    private backendCommunicator:BackendcommunicatorService,
    private dalaliCache: DalaliCachesService,
    private dIndexedDb:DalaliIndexDbService
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
  public paymentDetails:any={}
  private siteProds:any={}
  public daysDate:string=''
  public mWFLAns:boolean=false
  public calenderTypeMode:string=""
  public successOrderDetails:any =null
  public multiwayFLoopVisibility:string = 'nosite'
  public multiwayfLoopMsg:string = 'Welcome to dalali'
  public singlewayFLoopVisibility:string = 'nosite'
  public singlewayfLoopMsg:string = 'Welcome to dalali'
  public ageLimiterVisibility:string=''
  public dLoaderVisibility:string='nosite'
  public sectionProducts:Array<string>=[]
  public currentCartId:string = ""
  public cartProductsArray:Array<any>=[]
  public cartProductsDetails:any={}
  public paymentId:string=''
  public orderViewOrderId:string =''

  setUserBasicInfo(userDetails:any){
    this.userData.userDob=userDetails['userDob']
    this.userData.userContact=userDetails['userContact']
    this.userData.userName=userDetails['userName']
    this.userData.userType=userDetails['userType']
  }
  getUserBasiInfo():any{
    return this.userData
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

  addSiteProd(prodId:string,prodDetails:any):void{
    prodDetails.inCart=false
    this.siteProds[prodId]=prodDetails
  }

  getSiteProd(prodId:string):any{
    return this.siteProds[prodId]
  }

  getSiteProds():any{
    return this.siteProds
  }

  getSiteProdsList():Array<any>{
    let siteProdList:Array<any>=[]

    for (const productKey of Object.keys(this.siteProds)) {

      const productDetails:any = this.siteProds[productKey];
      siteProdList.push(productDetails)

    }
    return siteProdList
  }

  clearSiteProds(){
    this.siteProds={}
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

  //cart functions to migrate to cart service


  getTotalCartProductsPrice():number{
    let totalPrice:number=0
    this.cartProductsArray.forEach(cPAElement => {
        let prodPrice:number=Number(this.siteProds[cPAElement].retailPrice)
        let numberOfProducts:number=Number(this.siteProds[cPAElement].quantityOrdered)
        totalPrice+=prodPrice*numberOfProducts
    });
    return totalPrice
  }

  getTotalNumberOfProducts():number{
    let totalProductNumber:number=0
    this.cartProductsArray.forEach(cPAElement => {
        let numberOfProducts:number=Number(this.siteProds[cPAElement].quantityOrdered)
        totalProductNumber+=numberOfProducts
    });
    return totalProductNumber
  }

  addProdToCart(prodId:string,prodDetails:any,numbOrdered:any=1):boolean{

    let productAdded:boolean=false
    let productPresent:boolean=this.cartProductsArray.includes(prodId)

    const daysFullDate:any=this.getDaysDate()

    if(productPresent==false){

      if (this.currentCartId == ''){

        this.getCurrentCart(this.currentCartId).then((resp:any)=>{

          this.currentCartId=resp.id

          const productDetails:any={

            id:daysFullDate.daysDate+daysFullDate.daysTime,
            prodId:prodDetails.id,
            cartId:this.currentCartId,
            quantity:numbOrdered,
            complete:false,
            remaining:0

          }

          prodDetails.cartProdId = productDetails.id

          this.addCartDbProd(productDetails).catch((err:any)=>{

            console.error(err);


          })



        }).catch((err:any)=>{

          console.error(err);

        })

      }else{

        const productDetails:any={

          id:daysFullDate.daysDate+daysFullDate.daysTime,
          prodId:prodDetails.id,
          cartId:this.currentCartId,
          quantity:numbOrdered,
          complete:false,

        }

        prodDetails.cartProdId = productDetails.id

        this.addCartDbProd(productDetails).catch((err:any)=>{

          console.error(err);

        })

      }

      this.cartProductsArray.push(prodId)
      prodDetails.inCart=true

      prodDetails.quantityOrdered = numbOrdered
      productAdded=true

    }else{

      this.removeCartDbProd(prodDetails.cartProdId).then(()=>{

        if (this.cartProductsArray.length === 0){

          this.deleteCart(this.currentCartId)

        }

      }).catch((err:any)=>{

        console.error(err);

      })

      prodDetails.inCart=false

      this.cartProductsArray.splice(this.cartProductsArray.indexOf(prodId),1)

      productAdded=false

    }

    return productAdded

  }

  getCartProd(prodId:string):any{
    let cartProdDet:any=this.siteProds[prodId]
    return cartProdDet
  }

  getCartProds():Array<any>{
    let cartProducts:Array<any>= this.cartProductsArray
    return cartProducts
  }

  removeCartProd(prodId:string):Array<any>{
    let removed=false
    let newTotalNumber:number=0
    let newTotalValue:number=0
    try {

      this.cartProductsArray.splice(this.cartProductsArray.indexOf(prodId),1)

      let prodDetails:any=this.getSiteProd(prodId)
      prodDetails.inCart=false
      newTotalNumber=this.getTotalNumberOfProducts()
      newTotalValue=this.getTotalCartProductsPrice()
      removed=true

      this.removeCartDbProd(prodDetails.cartProdId).then(()=>{

        if (this.cartProductsArray.length === 0){

          this.deleteCart(this.currentCartId)

        }

      }).catch((err:any)=>{

        console.error(err);

      })

    } catch (error) {
      removed=false
    }
    return [newTotalValue,newTotalNumber,removed]
  }

  removeProdFromCart(prodId:string):boolean{
    let result:boolean=false
    try {

      const prodDetails:any = this.siteProds[prodId]

      this.cartProductsArray.splice(this.cartProductsArray.indexOf(prodId),1)

      prodDetails.inCart=false

      result=true

      this.removeCartDbProd(prodDetails.cartProdId).then(()=>{

        if (this.cartProductsArray.length === 0){

          this.deleteCart(this.currentCartId)

        }

      }).catch((err:any)=>{

        console.error(err);

      })

    } catch (error) {

      console.log(error);
      result=false

    }
    return result
  }

  setCartProdNumb(prodId:string,prodNumb:number):boolean{
    let changed=false
    try {

      const prodDet:any = this.siteProds[prodId]
      prodDet.quantityOrdered=prodNumb
      changed=true

      this.getCartDbProd(prodDet.cartProdId).then((cartDbProdDetails:any)=>{

        cartDbProdDetails.quantity=prodNumb

        this.updateCartDbProd(cartDbProdDetails).catch((err:any)=>{

          console.error(err);

        })

      }).catch((err:any)=>{

        console.log(err);

      })

    } catch (error) {
      console.log(error);
      changed=false
    }
    return changed
  }

  changeCartProdNumb(prodId:string,numberToIncreaseBy:number,type:string):Array<any>{
    let currentValue:number=Number(this.siteProds[prodId].quantityOrdered)
    let newValue:number=0
    let newTotal:number=0
    let newTotalProds:number=0
    let changeDone:boolean=false
    let productDetails:any=this.getSiteProd(prodId)
    let prouctQuant:number=Number(productDetails.quantity)
    if(type=="add"){
      newValue=currentValue+numberToIncreaseBy

      if(newValue>prouctQuant){
        this.siteProds[prodId].quantityOrdered=currentValue

        this.getCartDbProd(productDetails.cartProdId).then((cartDbProdDetails:any)=>{

          cartDbProdDetails.quantity=currentValue

          this.updateCartDbProd(cartDbProdDetails).catch((err:any)=>{

            console.error(err);

          })

        }).catch((err:any)=>{

          console.log(err);

        })

        newTotal=this.getTotalCartProductsPrice()
        newTotalProds=this.getTotalNumberOfProducts()
        changeDone=false

      }else{

        this.siteProds[prodId].quantityOrdered=newValue

        this.getCartDbProd(productDetails.cartProdId).then((cartDbProdDetails:any)=>{

          cartDbProdDetails.quantity=newValue

          this.updateCartDbProd(cartDbProdDetails).catch((err:any)=>{

            console.error(err);

          })

        }).catch((err:any)=>{

          console.log(err);

        })

        newTotal=this.getTotalCartProductsPrice()
        newTotalProds=this.getTotalNumberOfProducts()
        changeDone=true
      }
    }else if(type=="sabtruct"){
      newValue=currentValue-numberToIncreaseBy
      if(newValue>0){
        this.siteProds[prodId].quantityOrdered=newValue

        this.getCartDbProd(productDetails.cartProdId).then((cartDbProdDetails:any)=>{

          cartDbProdDetails.quantity=newValue

          this.updateCartDbProd(cartDbProdDetails).catch((err:any)=>{

            console.error(err);

          })

        }).catch((err:any)=>{

          console.log(err);

        })

        newTotal=this.getTotalCartProductsPrice()
        newTotalProds=this.getTotalNumberOfProducts()
        changeDone=true
      }else {
        this.siteProds[prodId].quantityOrdered=1

        this.getCartDbProd(productDetails.cartProdId).then((cartDbProdDetails:any)=>{

          cartDbProdDetails.quantity=1

          this.updateCartDbProd(cartDbProdDetails).catch((err:any)=>{

            console.error(err);

          })

        }).catch((err:any)=>{

          console.log(err);

        })

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
  }

  getCartDbStore(cartDbStore:string,cartDbStoreKey:string,storeIndex?:any):Promise<Array<any>>{

    return new Promise<Array<any>>((resolve, reject) => {

      this.dIndexedDb.writeToDatabase('dalali').then((dbDetails:Array<any>)=>{

        const currentDb:IDBDatabase=dbDetails[0]
        const currentTransaction:IDBTransaction=dbDetails[1]

        currentTransaction.oncomplete=()=>{

          this.dIndexedDb.updateObjectStore(

            currentDb,
            cartDbStore

          ).then((resp:IDBObjectStore)=>{

            resolve([resp,currentDb])

          }).catch((err:any)=>{

            console.error(err);

            currentDb.close()

            this.dIndexedDb.writeToDatabase('dalali').then((sDbDetails:Array<any>)=>{

              const sCurrentDb:IDBDatabase=sDbDetails[0]

              this.dIndexedDb.createObjectStore(

                sCurrentDb,
                cartDbStore,
                cartDbStoreKey

              ).then((cartsStore:IDBObjectStore)=>{

                if (storeIndex !== undefined){

                  if (Object.keys(storeIndex).length>0){

                    for (const storeIndexKeys of Object.keys(storeIndex)) {

                      cartsStore.createIndex(
                          storeIndex[storeIndexKeys],
                          storeIndex[storeIndexKeys],
                          {unique:false}
                        )

                    }
                  }

                }

                resolve([cartsStore,sCurrentDb])

              }).catch((err:any)=>{

                reject(err)

              })

            })

          })

        }

      })

    })
  }

  getCurrentCart(currentCartId:string):Promise<any>{

    return new Promise<any>((resolve, reject) => {

      const cartsStoreIndices:any = {
        cartDate:'cartDate',
        cartTime:'cartTime',
        cartAccount:'cartAccount',
        cartState:'cartState',
        cartOrderId:'cartOrderId',
        cartSaleId:'cartSaleId',
        cartType:'cartType',
        complete:'complete',
        retailer:'retailer'
      }

      this.getCartDbStore('userCarts','id',cartsStoreIndices).then((cartStoreDetails:Array<any>)=>{

        const cartDb:IDBDatabase=cartStoreDetails[1]
        const cartsStore:IDBObjectStore=cartStoreDetails[0]

        this.getPendingCart(cartsStore).then((resp:any)=>{

          if (resp != undefined){

            currentCartId = resp.id

          }

          if (currentCartId === ""){

            this.createCurrentCart(cartsStore).then((resp:IDBRequest)=>{

              const cartId:any=resp.result
              cartDb.close()
              resolve({"id":cartId});

            }).catch((err:any)=>{

              cartDb.close()
              reject(err);

            })
          }else{

            this.dIndexedDb.readRecord(cartsStore,currentCartId).then((currentCart:IDBRequest)=>{
              cartDb.close()
              resolve(currentCart.result);

            }).catch((err:any)=>{

              cartDb.close()
              reject(err);

            })

          }

        })

      })

    })

  }

  getDaysDate():any{

    const today:Date = new Date();

    const DD:string = String(today.getDate()).padStart(2, '0');
    const MM:string = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const YYYY:string = String(today.getFullYear());

    const hh:string = String(today.getHours()).padStart(2, '0');
    const mm:string = String(today.getMinutes()).padStart(2, '0');
    const ss:string = String(today.getSeconds()).padStart(2, '0');
    const mil:string = String(today.getMilliseconds()).padStart(3, '0');

    const daysDate:string = YYYY + MM + DD;

    const daysTime:string = hh + mm + ss + mil;

    const daysFullDate:any={
      daysDate,
      daysTime
    }

    return daysFullDate
  }

  createCurrentCart(cartsStore:IDBObjectStore):Promise<any>{

    return new Promise<any>((resolve, reject) => {

      const daysFullDate:any = this.getDaysDate()

      const cartDate:string=daysFullDate.daysDate

      const cartTime:string=daysFullDate.daysTime

      const id:string = cartDate+ cartTime + "::id::" + this.userData.userContact;

      const cartAccount:string = this.userData.userContact;

      const cartState:string = 'pending';

      const cartOrderId:any = null;

      const cartSaleId:any = null;

      const cartType:string = 'order';

      const complete:boolean = false;

      const retailer:any = null

      this.currentCartId=id;

      const cartDetails:any = {
        id,
        cartDate,
        cartTime,
        cartAccount,
        cartState,
        cartOrderId,
        cartSaleId,
        cartType,
        complete,
        retailer
      }

      this.dIndexedDb.addRecord(cartsStore,cartDetails).then((resp:IDBRequest)=>{

        resolve(resp);

      }).catch((err:any)=>{

        reject(err);

      })

    })

  }

  getPendingCart(userCart:IDBObjectStore):Promise<any>{

    return new Promise<any>((resolve, reject) => {

      const cartStateIndex:IDBIndex = userCart.index("cartAccount")

      const dbRequest:IDBRequest = cartStateIndex.openCursor(this.userData.userContact)

      dbRequest.onsuccess = (evt:any)=>{

        const cursor:IDBCursorWithValue = dbRequest.result;

        if (cursor) {

          const recordValue:any = cursor.value

          if (recordValue.cartState == "pending"){

            resolve(recordValue);

          }else{

            cursor.continue();

          }

        }else{
          resolve(undefined)
        }
      }

      dbRequest.onerror=(err:any)=>{

        reject(err)

      }

    })
  }

  getDbCart(cartId:string): Promise<any>{

    return new Promise<any>((resolve, reject) => {
      this.getCartDbStore('userCarts','id').then((cartStoreDetails:Array<any>)=>{
        const cartStore:IDBObjectStore = cartStoreDetails[0]

        this.dIndexedDb.readRecord(cartStore,cartId).then((recordResp:IDBRequest)=>{

          resolve(recordResp.result)

        }).catch((err:any)=>{

          reject(err)

        })

      })

    })

  }

  updateDbCart(cartDetails:any):Promise<any>{

    return new Promise<any>((resolve, reject) => {
      this.getCartDbStore('userCarts','id').then((cartStoreDetails:Array<any>)=>{

        const cartStore:IDBObjectStore = cartStoreDetails[0]

        this.dIndexedDb.updateRecord(cartStore,cartDetails).then((addResp:IDBRequest)=>{

          resolve(addResp.result)

        }).catch((err:any)=>{

          reject(err)

        })

      })

    })

  }

  // cart products


  getCartProductsStore():Promise<IDBObjectStore>{

      const storeIndex:any = {
        prodId:'prodId',
        cartId:'cartId',
        quantity:'quantity',
        complete:'complete',
        remaining:'remaining'
      }

    return new Promise<IDBObjectStore>((resolve, reject) => {

      this.dIndexedDb.writeToDatabase('dalali').then((dbDetails:Array<any>)=>{

        const currentDb:IDBDatabase=dbDetails[0]
        const currentTransaction:IDBTransaction=dbDetails[1]

        currentTransaction.oncomplete=()=>{

          this.dIndexedDb.updateObjectStore(

            currentDb,
            'cartsProducts'

          ).then((resp:IDBObjectStore)=>{

            resolve(resp)

          }).catch((err:any)=>{

            currentDb.close()

            this.dIndexedDb.writeToDatabase('dalali').then((sDbDetails:Array<any>)=>{

              const sCurrentDb:IDBDatabase=sDbDetails[0]

              this.dIndexedDb.createObjectStore(

                sCurrentDb,
                'cartsProducts',
                'id'

              ).then((cartsStore:IDBObjectStore)=>{

                if (storeIndex !== undefined){

                  if (Object.keys(storeIndex).length>0){

                    for (const storeIndexKeys of Object.keys(storeIndex)) {

                      cartsStore.createIndex(
                          storeIndex[storeIndexKeys],
                          storeIndex[storeIndexKeys],
                          {unique:false}
                        )

                    }
                  }

                }

                resolve(cartsStore)

              }).catch((err:any)=>{

                reject(err)

              })

            })

          })

        }

      })

    })

  }

  getCartDbProd(prodId:string):Promise<any>{

    return new Promise<any>((resolve, reject) => {

      this.getCartProductsStore().then((cartsProductsStore:IDBObjectStore)=>{

        this.dIndexedDb.readRecord(cartsProductsStore,prodId).then((dbRepResp:IDBRequest)=>{

          resolve(dbRepResp.result)

        }).catch((err:any)=>{
          reject(err)
        })

      }).catch((err:any)=>{

        reject(err)

      })

    })

  }

  addCartDbProd(prodDetails:any):Promise<any>{

    return new Promise<any>((resolve, reject) => {

      this.getCartProductsStore().then((cartsProductsStore:IDBObjectStore)=>{

        this.dIndexedDb.addRecord(cartsProductsStore,prodDetails).then((addResp:IDBRequest)=>{

          resolve(addResp.result)

        }).catch((err:any)=>{

          reject(err)

        })

      }).catch((err:any)=>{

        reject(err)

      })

    })

  }

  updateCartDbProd(prodDetails:any):Promise<any>{

    return new Promise<any>((resolve, reject) => {

      this.getCartProductsStore().then((cartsProductsStore:IDBObjectStore)=>{

        this.dIndexedDb.updateRecord(cartsProductsStore,prodDetails).then((updateResp:IDBRequest)=>{

          resolve(updateResp.result)

        }).catch((err:any)=>{

          reject(err)

        })

      }).catch((err:any)=>{

        reject(err)

      })

    })

  }

  removeCartDbProd(prodId:string):Promise<any>{

    return new Promise<any>((resolve, reject) => {

      this.getCartProductsStore().then((cartsProductsStore:IDBObjectStore)=>{

        this.dIndexedDb.deleteRecord(cartsProductsStore,prodId).then((deleteResp:IDBRequest)=>{

          resolve(deleteResp.result)

        }).catch((err:any)=>{

          reject(err)

        })

      }).catch((err:any)=>{

        reject(err)

      })

    })

  }

  deleteCart(cartId:string):Promise<boolean>{

    return new Promise<boolean>((resolve, reject) => {

      this.getCartProductsStore().then((productsStore:IDBObjectStore)=>{

        const cartsProductsIndex:IDBIndex=productsStore.index('cartId')

        const dbRequest:IDBRequest = cartsProductsIndex.openCursor(cartId)

        dbRequest.onsuccess = ()=>{

          const cursor:IDBCursorWithValue = dbRequest.result;

          if (cursor) {

            cursor.delete()

            cursor.continue();

          }else{

            this.getCartDbStore('userCarts','id').then((resp:Array<any>)=>{

              const cCartStore:IDBObjectStore=resp[0]

              this.dIndexedDb.deleteRecord(cCartStore,cartId).then((delResp:IDBRequest)=>{

                resolve(true)

              }).catch((err:any)=>{

                reject(err)

              })

            }).catch((err:any)=>{

              reject(err)

            })

          }

        }

        dbRequest.onerror=((err:any)=>{

          reject(err)

        })

      })

    })

  }

  getDbCartProds(cartId:string):Promise<Array<any>>{
    return new Promise<Array<any>>((resolve, reject) => {

      this.getCartProductsStore().then((productsStore:IDBObjectStore)=>{

        const cartsProductsIndex:IDBIndex=productsStore.index('cartId')

        const dbRequest:IDBRequest = cartsProductsIndex.openCursor(cartId)

        dbRequest.onsuccess = ()=>{

          const cursor:IDBCursorWithValue = dbRequest.result;

          if (cursor) {

            const cartProd:any = this.siteProds[cursor.value.prodId]
            cartProd.cartProdId=cursor.value.id
            cartProd.inCart=true
            cartProd.quantityOrdered=cursor.value.quantity
            cartProd.remaining=cursor.value.remaining
            this.cartProductsArray.push(cursor.value.prodId)

            cursor.continue();

          }else{

            resolve(this.cartProductsArray)

          }

        }

        dbRequest.onerror=((err:any)=>{

          reject(err)

        })

      })

    })

  }

  getOrderDbCartProds(cartId:string):Promise<Array<any>>{
    return new Promise<Array<any>>((resolve, reject) => {

      const orderProds:Array<any>=[]

      this.getCartProductsStore().then((productsStore:IDBObjectStore)=>{

        const cartsProductsIndex:IDBIndex=productsStore.index('cartId')

        const dbRequest:IDBRequest = cartsProductsIndex.openCursor(cartId)

        dbRequest.onsuccess = ()=>{

          const cursor:IDBCursorWithValue = dbRequest.result;

          if (cursor) {

            const cartProd:any = this.siteProds[cursor.value.prodId]
            cartProd.cartProdId=cursor.value.id
            cartProd.inCart=true
            cartProd.quantityOrdered=cursor.value.quantity
            cartProd.remaining=cursor.value.remaining
            orderProds.push(cartProd)

            cursor.continue();

          }else{

            resolve(orderProds)

          }

        }

        dbRequest.onerror=((err:any)=>{

          reject(err)

        })

      })

    })

  }

  recordSale():Promise<boolean>{

    return new Promise<boolean>((resolve, reject) => {

      this.getDbCart(this.currentCartId).then((dbCart:any)=>{

        dbCart.cartState = 'sale'

        this.updateDbCart(dbCart).then(()=>{

          resolve(true)

        }).catch((err:any)=>{

          reject(err);

        })

      }).catch((err:any)=>{

        reject(err);

      })

    })

  }

  sendSale():void{

    const saleForm:FormData = new FormData()

    saleForm.append('orderId',this.currentCartId)
    saleForm.append('soldProducts',JSON.stringify(this.cartProductsArray))
    saleForm.append('paymentId',this.paymentId)

    this.backendCommunicator.backendCommunicator(saleForm,'POST',`${this.backendCommunicator.backendBaseLink}/recordSale`).then((resp:any)=>{

      const complete:boolean = resp.complete
      const prodDetails:Array<any>=resp.prodDetails
      const retailer:string = resp.retailer
      const saleId:string = resp.saleId

      this.getDbCart(this.currentCartId).then((curCart:any)=>{

        if (complete){

          curCart.complete = true

        }

        curCart.cartSaleId = saleId
        curCart.retailer = retailer

        this.updateDbCartProds(this.currentCartId,prodDetails).then((resp:boolean)=>{

          this.updateDbCart(curCart)

        }).catch((err:any)=>{

          console.error(err);

        })


      }).catch((err:any)=>{

        console.error(err);

      })

    }).catch((err:any)=>{

      console.error(err);

    })
  }

  updateDbCartProds(cartId:string,prodDetails:any):Promise<boolean>{

    return new Promise<boolean>((resolve, reject) => {

      this.getCartProductsStore().then((productsStore:IDBObjectStore)=>{

        const cartsProductsIndex:IDBIndex=productsStore.index('cartId')

        const dbRequest:IDBRequest = cartsProductsIndex.openCursor(cartId)

        dbRequest.onsuccess = ()=>{

          const cursor:IDBCursorWithValue = dbRequest.result;

          if (cursor) {

            const cartProd:any = cursor.value


            for (const prodDet of prodDetails) {

              if (prodDet.id == cartProd.prodId ){

                if (prodDet.remaining <= 0){

                  cartProd.complete=true


                }else{
                  cartProd.remaining = prodDet.remaining

                }

                cursor.update(cartProd)


              }

            }

            cursor.continue();

          }else{

            resolve(true)

          }

        }

        dbRequest.onerror=((err:any)=>{

          reject(err)

        })

      })

    })

  }

  getOrders(accountId:string,completeness:boolean):Promise<any>{

    return new Promise<any>((resolve, reject) => {

      const cartsStoreIndices:any = {
        cartDate:'cartDate',
        cartTime:'cartTime',
        cartAccount:'cartAccount',
        cartState:'cartState',
        cartOrderId:'cartOrderId',
        cartSaleId:'cartSaleId',
        cartType:'cartType',
        complete:'complete',
        retailer:'retailer'
      }

      this.getCartDbStore('userCarts','id',cartsStoreIndices).then((cartStoreDetails:Array<any>)=>{

        const cartsStore:IDBObjectStore = cartStoreDetails[0]


        const userCartsIndex:IDBIndex=cartsStore.index('cartAccount')

        const dbRequest:IDBRequest = userCartsIndex.openCursor(accountId)

        const userOrders:Array<any>=[]

        dbRequest.onsuccess = ()=>{

          const cursor:IDBCursorWithValue = dbRequest.result;

          if (cursor) {

            const userOrder:any = cursor.value

            if (userOrder.complete = completeness){

              userOrders.push(userOrder)

            }

            cursor.continue()
          }else{
            resolve(userOrders)
          }

        }

        dbRequest.onerror=(err:any)=>{

          reject(err)

        }

      }).catch((err:any)=>{

        reject(err)

      })

    })

  }


  //retailer sales

  getDefaultSales():void{

    const defaultSalesForm:FormData = new FormData()

    defaultSalesForm.append("contact",this.userData.userContact)

    this.backendCommunicator.backendCommunicator(
      defaultSalesForm,"POST",
      `${this.backendCommunicator.backendBaseLink}/defaultSales`
    ).then((resp:any)=>{

      this.addSales(resp);

    })

  }

  addSalesToDb(salesDetails:Array<any>):Promise<any>{

    return new Promise<any>((resolve, reject) => {

      const salesStoreIndices:any = {
        complete:'complete',
        oderId:'oderId',
        totalPrice:'totalPrice',
        newSale:'newSale',
        retailer:'retailer'
      }

      this.getCartDbStore('sales','id',salesStoreIndices).then((saleStoreDetails:Array<any>)=>{

        const salesStore:IDBObjectStore=saleStoreDetails[0]

        const salesAdded:Array<any>=[]

        for (const saleDetails of salesDetails) {

          this.createSale(salesStore,saleDetails).then((resp:IDBRequest)=>{

            const cartId:any=resp.result
            salesAdded.push(cartId)


          }).catch((err:any)=>{

            reject(err);

          })

        }

        resolve(salesAdded);

      })

    })
  }

  createSale(salesStore:IDBObjectStore,saleDetails:any):Promise<any>{

    return new Promise<any>((resolve, reject) => {

      this.dIndexedDb.addRecord(salesStore,saleDetails).then((resp:IDBRequest)=>{

        resolve(resp);

      }).catch((err:any)=>{

        reject(err);

      })

    })

  }

  addSales(sales:Array<any>):void{

    const cleanedSales:Array<any> = []
    const salesProducts:any = {}

    for (const sale of sales) {

      const cleanedSale:any = {
        id:sale.saleId,
        oderId:sale.orderId,
        totalPrice:sale.totalPrice,
        complete:sale.complete,
        newSale:true,
        retailer:this.userData.userContact
      }

      for (const prodDets of sale.prodDetails) {

        const id:string =sale.prodDetails.indexOf(prodDets) + "::id::" + sale.saleId;

        prodDets.id = id
        prodDets.saleId = sale.saleId

      }

      salesProducts[sale.saleId]=sale.prodDetails

      cleanedSales.push(cleanedSale)

    }

    this.addSalesToDb(cleanedSales).then(()=>{

      this.addSalesProductsToDb(salesProducts).catch((err:any)=>{

        console.error(err);

      })

    }).catch((err:any)=>{

      console.error(err);

    })

  }
  addSalesProductsToDb(salesProducts:any):Promise<any>{

    return new Promise<any>((resolve, reject) => {

      const salesProductsStoreIndices:any = {
        prodId:'prodId',
        quantiyOrdered:'quantiyOrdered',
        remaining:'remaining',
        price:'price',
        saleId:'SaleId'
      }

      this.getCartDbStore('productsSold','id',salesProductsStoreIndices).then((salesProductsStoreDetails:Array<any>)=>{

        const salesProductsStore:IDBObjectStore=salesProductsStoreDetails[0]

        const salesProductsAdded:Array<any>=[]

        for (const saleProductsDetails of Object.keys(salesProducts)) {

          for (const saleProductDetails of salesProducts[saleProductsDetails]) {

            this.createSale(salesProductsStore,saleProductDetails).then((resp:IDBRequest)=>{

              const saleProductId:any=resp.result
              salesProductsAdded.push(saleProductId)


            }).catch((err:any)=>{

              reject(err);

            })

          }

        }

        resolve(salesProductsAdded);

      })


    })
  }

}
