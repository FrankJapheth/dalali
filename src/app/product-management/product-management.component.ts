import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { BackendcommunicatorService } from '../backendcommunicator.service';
import { DalalidataService } from '../dalalidata.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {

  constructor(
    private eleRef:ElementRef,
    private renderer:Renderer2,
    private dataService:DalalidataService,
    private backendComms:BackendcommunicatorService
  ) { }
  public maxProdIndexSet:boolean=false
  public maxProdSearchIndex:string=""
  public prodSearchResult:any=[]
  public productIndexArray:Array<any>=[]
  public selecteProductIndexArray:Array<any>=[]
  public editList:Array<any>=[]
  public editListToDisplay:Array<any>=[]
  public productEditIndex:number=-1
  public baseLink:string=this.backendComms.backendBaseLink
  public productColumns:Array<any>=[]
  public productColumnsFetched:boolean=false
  public docPicAdded:boolean=false
  private imgPicToSend:any=null
  private imgProdId:any=null
  public currentEditingProduct:Array<any>=[]
  public columnsToAsk:Array<string>=[]  
  public nativeColumnIndeces:Array<string>=[]
  private specialKeysOn:boolean=false
  private specialKey: string =''
  private initVal: number=0
  ngOnInit(): void {
  }
  ngAfterViewInit():void{
    if (this.productColumnsFetched==false) {
      this.dataService.getTableColumnNames("products").then((resp:any)=>{
        let columnsToEit:Array<string>=this.dataService.getColumnToEdit()
        columnsToEit.forEach((columnToEdit:string)=>{
          this.columnsToAsk.push(columnToEdit)
        })
        resp.forEach((column_name:any) => {
          this.nativeColumnIndeces.push(column_name[0])
        });       
        this.productColumnsFetched=true
      })
    }
  }
  searchProductToEdit(evt:any):void{
    if(this.maxProdIndexSet==false){
      this.dataService.getMaxProdIndex().then((resp:any)=>{
        this.maxProdIndexSet=true
        this.maxProdSearchIndex=resp
        let searchValue:string=evt.target.value
        if(searchValue!=""){
          let searchForm:FormData=new FormData()
          searchForm.append("prodIdentity",searchValue)
          searchForm.append("maxProdIndex",this.maxProdSearchIndex)
          this.backendComms.backendCommunicator(searchForm,"post",`${this.backendComms.backendBaseLink}/searchProds`).then((resp:any)=>{
            this.createProductIndexArray(resp).then(()=>{
              let respFormted:any=[]
              resp.forEach((pSREle:any) => {
                let prodId:string=pSREle[0]
                if(this.selecteProductIndexArray.includes(prodId)==true){
                  pSREle.push(true)
                }else{
                  pSREle.push(false)
                }
                respFormted.push(pSREle)
              });
              return respFormted
            }).then((formatedResp:any)=>{
              this.prodSearchResult=formatedResp
            })
          })
        }
      })
    }else{
      let searchValue:string=evt.target.value
      if(searchValue!=""){
        let sRPDTabHolder:any=this.eleRef.nativeElement.querySelectorAll(".sRPDTabHolder")
        let searchResultHolder:any=this.eleRef.nativeElement.querySelector(".searchResultHolder")
        if(sRPDTabHolder.length>0){
          sRPDTabHolder.forEach((arrayEle:any) => {
            this.renderer.removeChild(searchResultHolder,arrayEle)
          });
        }
        let searchForm:FormData=new FormData()
        searchForm.append("prodIdentity",searchValue)
        searchForm.append("maxProdIndex",this.maxProdSearchIndex)
        this.backendComms.backendCommunicator(searchForm,"post",`${this.backendComms.backendBaseLink}/searchProds`).then((resp:any)=>{
          this.createProductIndexArray(resp).then(()=>{
            let respFormted:any=[]
            resp.forEach((pSREle:any) => {
              let prodId:string=pSREle[0]
              if(this.selecteProductIndexArray.includes(prodId)==true){
                pSREle.push(true)
              }else{
                pSREle.push(false)
              }
              respFormted.push(pSREle)
            });
            return respFormted
          }).then((formatedResp:any)=>{
            this.prodSearchResult=formatedResp
          })
        })
      }
    }    
  }
  addToEditList(evt:any):void{
    let sRPDTabClickerId:any=evt.target.id.slice(6)
    let indexOfProd:any=this.productIndexArray.indexOf(sRPDTabClickerId)
    let RPDTCPTAId:string=`#RPDTCPTA${sRPDTabClickerId}`
    let sRPDTCPTId:string=`#sRPDTCPT${sRPDTabClickerId}`
    let RPDTCPTAEle:any=this.eleRef.nativeElement.querySelector(RPDTCPTAId)
    let sRPDTCPTEle:any=this.eleRef.nativeElement.querySelector(sRPDTCPTId)
    if(this.selecteProductIndexArray.includes(sRPDTabClickerId)==false){
      this.editList.push(this.prodSearchResult[indexOfProd])
      this.editListToDisplay.push(this.prodSearchResult[indexOfProd])
      this.selecteProductIndexArray.push(sRPDTabClickerId)
      if(RPDTCPTAEle!=null){
        this.renderer.removeClass(RPDTCPTAEle,"nosite")
      }else{
        this.renderer.removeClass(sRPDTCPTEle,"nosite")
      }
    }else{
      this.editList.splice(this.selecteProductIndexArray.indexOf(sRPDTabClickerId),1)
      this.editListToDisplay.splice(this.selecteProductIndexArray.indexOf(sRPDTabClickerId),1)
      this.selecteProductIndexArray.splice(this.selecteProductIndexArray.indexOf(sRPDTabClickerId),1)
      if(RPDTCPTAEle==null){
        this.renderer.addClass(sRPDTCPTEle,"nosite")
      }else{
        this.renderer.addClass(RPDTCPTAEle,"nosite")        
      }
    }
  }
  createProductIndexArray(arrayOfProductArray:any):Promise<any>{
    return new Promise((addResp:any,addRej:any)=>{
      this.productIndexArray=[]
      arrayOfProductArray.forEach((productArray:any)=>{
        this.productIndexArray.push(productArray[0])
      })
      addResp([this.productIndexArray,arrayOfProductArray])
    })
  }
  pSBCHDCancelBut():void{
    let docProdManagementControls:any=this.eleRef.nativeElement.querySelector(".prodManagementControls")
    this.renderer.addClass(docProdManagementControls,"nosite")
    let docProdManagementBody:any=this.eleRef.nativeElement.querySelector(".prodManagementBody")
    this.renderer.removeClass(docProdManagementBody,"nosite")
  }
  changeProductetails():void{
    let docProdManagementBody:any=this.eleRef.nativeElement.querySelector(".prodManagementBody")
    this.renderer.addClass(docProdManagementBody,"nosite")
    let docProdManagementControls:any=this.eleRef.nativeElement.querySelector(".prodManagementControls")
    this.renderer.removeClass(docProdManagementControls,"nosite")
  }

  closeForm():void{
    let docProductDetailsCangeForm:any=this.eleRef.nativeElement.querySelector(".productDetailsCangeForm")
    this.renderer.addClass(docProductDetailsCangeForm,"nosite")
    let doceditableColumnsToChoose:any=this.eleRef.nativeElement.querySelector(".editableColumnsToChoose")
    this.renderer.removeClass(doceditableColumnsToChoose,"nosite")
  }

  pSBCHDDDoneBut():void{
    let docproductSelection:any=this.eleRef.nativeElement.querySelector(".productSelection")
    this.renderer.addClass(docproductSelection,"nosite")

    let doceditableColumnsToChoose:any=this.eleRef.nativeElement.querySelector(".editableColumnsToChoose")
    this.renderer.removeClass(doceditableColumnsToChoose,"nosite")
  }

  eCTCBFCBut():void{

    let doceditableColumnsToChoose:any=this.eleRef.nativeElement.querySelector(".editableColumnsToChoose")
    this.renderer.addClass(doceditableColumnsToChoose,"nosite")

    let docproductSelection:any=this.eleRef.nativeElement.querySelector(".productSelection")
    this.renderer.removeClass(docproductSelection,"nosite")
  }
  eCTCBFDBut():void{

    let doceditableColumnsToChoose:any=this.eleRef.nativeElement.querySelector(".editableColumnsToChoose")
    this.renderer.addClass(doceditableColumnsToChoose,"nosite")

    let docproductDetailsCangeForm:any=this.eleRef.nativeElement.querySelector(".productDetailsCangeForm")
    this.renderer.removeClass(docproductDetailsCangeForm,"nosite")

    this.currentEditingProduct=this.getProductToEdit("forward")
    this.displayChosenProduct(this.currentEditingProduct)

  }
  getProductToEdit(direction:string):Array<any>{
    let productDetails:Array<any>=[]

    if(direction=="forward"){
      this.productEditIndex+=1
    }else if(direction=="backward"){
      this.productEditIndex-=1
    }

    if(this.productEditIndex<0){
      this.productEditIndex=this.editList.length-1
    }else if(this.productEditIndex>=this.editList.length){
      this.productEditIndex=0
    }
    productDetails=this.editList[this.productEditIndex]

    return productDetails
  }
  pDCBCCPNPButton():void{
    this.currentEditingProduct=this.getProductToEdit("forward")
    this.displayChosenProduct(this.currentEditingProduct)
  }  
  pDCBPCCPPPButton():void{
    this.currentEditingProduct=this.getProductToEdit("backward")
    this.displayChosenProduct(this.currentEditingProduct)    
  }
  displayChosenProduct(productDetails:Array<any>):void{

    let docInputs:any=this.eleRef.nativeElement.querySelectorAll(".pDCBDSInput")
    let docprodMediaDiv:any=this.eleRef.nativeElement.querySelector(".prodMediaDiv")
    for (let index = 0; index < docInputs.length; index++) {
      let productInput:any=docInputs[index]
      let unanimousIndex=productInput.id.slice(7)
      let producDetail:string=productDetails[unanimousIndex]
      this.renderer.addClass(docprodMediaDiv,"nosite")      
      if(producDetail!=null){
        this.imgProdId=productDetails[0]
        if (unanimousIndex==1) {
          this.eleRef.nativeElement.querySelector(".pDCFHProdName").innerText=productDetails[unanimousIndex]
        }
        if (unanimousIndex==7) {       
          let pMDMHMedia=this.eleRef.nativeElement.querySelector(".pMDMHMedia")
          pMDMHMedia.src=`${this.baseLink}${producDetail}`
          productInput.value=`${producDetail}`
          let pDCBDSIH=this.eleRef.nativeElement.querySelector(`#pDCBDSIH${unanimousIndex}`)
          this.renderer.removeClass(docprodMediaDiv,"nosite")
          if(pDCBDSIH!=null){
            this.renderer.addClass(pDCBDSIH,"nosite")
          }
        }else{
          productInput.value=producDetail
        }
      }else{
        let pDCBDSIH=this.eleRef.nativeElement.querySelector(`#pDCBDSIH${unanimousIndex}`)
        if(pDCBDSIH!=null){
          this.renderer.addClass(pDCBDSIH,"nosite")
        }
      }
    }
  }
  imgReducer(imgData:any):Promise<Blob>{
    return new Promise((fTSResp,fTSRej)=>{
      let imgToResize:any=new Image()
      let imgholdertest:any=this.eleRef.nativeElement.querySelector(".imgholdertest")
      imgToResize.onload=()=>{ 
        let docImgToResize:any=this.eleRef.nativeElement.querySelector(".imgTosend")
        if(docImgToResize!=null){ 
          this.renderer.removeChild(imgholdertest,docImgToResize)
          this.docPicAdded=false
        }
        let iTRNH:number=imgToResize.naturalHeight
        let iTRNW:number=imgToResize.naturalWidth
        imgToResize.classList="imgTosend"
        let newImgHeight:number=400
        let newImgWidth:number=400
        if(iTRNH>iTRNW){
          imgToResize.style.height=newImgHeight+"px"
          imgToResize.style.width="auto"
        }else if(iTRNH<iTRNW){
          imgToResize.style.width=newImgWidth+"px"
          imgToResize.style.height="auto"
        }else{
          imgToResize.style.width=newImgWidth+"px"
          imgToResize.style.height="auto"
        }  
        if(this.docPicAdded==false){
          this.renderer.appendChild(imgholdertest,imgToResize)
          let imgTosend:any=this.eleRef.nativeElement.querySelector(".imgTosend")
          let reducedHeight:number=imgTosend.offsetHeight
          let reducedWidth:number=imgTosend.offsetWidth
          let reducedImgCanvas:any=document.createElement("canvas")
          reducedImgCanvas.height=reducedHeight
          reducedImgCanvas.width=reducedWidth
          let resizerContext:any=reducedImgCanvas.getContext("2d")
          resizerContext.drawImage(imgToResize, 0, 0, reducedWidth, reducedHeight)
          reducedImgCanvas.toBlob((imgtostore:any)=>{
            fTSResp(imgtostore)
        },'image/png')
          this.docPicAdded=true
        }
      }
      imgToResize.src=imgData
    })
  }
  cMDBut():void{
    this.eleRef.nativeElement.querySelector("#newPic").click()
  }
  img_file_reader(fileToRead:any):Promise<Blob>{
    return new Promise((imgRes:any,imgRej:any)=>{
      let imgReader:FileReader=new FileReader()
      imgReader.onloadend=()=>{
        let imgData:any=imgReader.result
        this.imgReducer(imgData).then(imgResp=>{
          imgRes([imgResp,imgData])
        })
      }
      imgReader.readAsDataURL(fileToRead)
    })
  }
  newPic(evt:any):void{
    let chosenFile:any=evt.target.files[0]
    this.img_file_reader(chosenFile).then((imgRes:any)=>{
      let docpMDMHMedia=this.eleRef.nativeElement.querySelector(".pMDMHMedia")
      docpMDMHMedia.src=imgRes[1]
      this.imgPicToSend=imgRes[0]
      this.renderer.removeClass(
        this.eleRef.nativeElement.querySelector(".sendImgPrompt"),"nosite"
      )
    })
  }
  sendProductImg():void{
    let productImgForm:FormData=new FormData()
    productImgForm.append("Barcode",this.imgProdId)
    productImgForm.append("imgdata",this.imgPicToSend)
    productImgForm.append('retailerId',this.dataService.userData.userContact)
    this.backendComms.backendCommunicator(productImgForm,"post",
    `${this.backendComms.backendBaseLink}/changeImg`).then((resp:any)=>{
      this.currentEditingProduct[7]=resp
      let productInput:any=this.eleRef.nativeElement.querySelector("#pDCBDSI7")
      productInput.value=resp
    })
    this.renderer.addClass(
      this.eleRef.nativeElement.querySelector(".sendImgPrompt"),"nosite"
    )
  }
  cBCBut():void{
    this.renderer.addClass(
      this.eleRef.nativeElement.querySelector(".sendImgPrompt"),"nosite"
    )    
  }
  sendOtherDetails():void{
    let docpDCBDSInputs:any=this.eleRef.nativeElement.querySelectorAll(".pDCBDSInput")
    let columnNames:Array<string>=[]
    let columnValues:any={}
    let prodChangedInf:FormData=new FormData()
    docpDCBDSInputs.forEach((docpDCBDSInput:any) => {
      columnNames.push(docpDCBDSInput.name);
      columnValues[docpDCBDSInput.name]=docpDCBDSInput.value;
    });
    prodChangedInf.append("productId",this.imgProdId)
    prodChangedInf.append("columnsToEdit",JSON.stringify(columnNames))
    prodChangedInf.append("columnValues",JSON.stringify(columnValues))
    prodChangedInf.append('retailerId',this.dataService.userData.userContact)
  
    
    this.backendComms.backendCommunicator(prodChangedInf,"post",
    `${this.baseLink}/changeInfo`).then((resp:any)=>{
      for (let index = 0; index < resp.length; index++) {
        const prodDetail:any = resp[index];
        this.currentEditingProduct[index]=prodDetail
      } 
      this.currentEditingProduct=this.getProductToEdit("forward")
      this.displayChosenProduct(this.currentEditingProduct)
    })

  }
  columnToChooseTile(evt:any):void{

    let cTId:string=evt.target.id.slice(4)  
    let columnNameElem:any=this.eleRef.nativeElement.querySelector(`#tD${cTId}`)    
    if(this.productColumns.includes(columnNameElem.innerText)==false){
      this.productColumns.push(columnNameElem.innerText)
      this.renderer.removeClass(
        this.eleRef.nativeElement.querySelector(`#cTCTCT${cTId}`),"nosite"
      )
    }else{
      this.productColumns.splice(this.productColumns.indexOf(columnNameElem.innerText),1)  
      this.renderer.addClass(
        this.eleRef.nativeElement.querySelector(`#cTCTCT${cTId}`),"nosite"
      )    
    }
  }

  //productAttributesChangesKeyboardEvents
  pACKBEvents(evt:any): void{    
    const keyPressed: any = evt.key;
    if (keyPressed === 'Control'){
      this.specialKeysOn=true
      this.specialKey=keyPressed
    }
    if( this.specialKeysOn){
      if(this.specialKey==='Control' && keyPressed.toLowerCase()==='z'){
        evt.target.value=this.initVal
      }
    }
    if (keyPressed=== 'Enter'){
      let searchString: any =evt.target.value;
      let firstSplit: any = searchString.split(":")
      this.initVal = Number(firstSplit.shift());
      
      let indexOfSign: number = firstSplit[0].search("[/+]")
      let fromIndexSignToEnd: string = firstSplit[0].substring(indexOfSign+1)

      let multResult: number = this.numberMultiplication(fromIndexSignToEnd)

      if ( String(this.initVal) != 'NaN'){ 
        let finalVal: number = this.initVal+multResult
        evt.target.value=finalVal
      }else{
        alert("Initial value is not a number, it should be a number")
      }
    }
  }

  kEKU(evt: any): void{  

    const keyPressed: any = evt.key;
    if (keyPressed === 'Control'){
      this.specialKeysOn=false
    }

  }

  numberMultiplication( textToPerform: string): number{
    
    let result: number = 0;
    let multSignIndex: number = textToPerform.search("[/*]")
    let firstArg: number = Number(textToPerform.substring(0,multSignIndex))
    let secondArg: number = Number(textToPerform.substring(multSignIndex+1))
    result=firstArg*secondArg
    
    return result
  }
}
