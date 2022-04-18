import { Component, OnInit,ElementRef,Renderer2 } from '@angular/core';
import { BackendcommunicatorService } from '../backendcommunicator.service';
import { DalalidataService } from '../dalalidata.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit {

  constructor(
    private dataServices:DalalidataService,
    private eleRef:ElementRef,
    private renderer:Renderer2,
    private backComs:BackendcommunicatorService
  ) { }
  
  public uploadType:string=this.dataServices.uploadType
  private chosenFiles:Array<File>=[]
  private fileCounter:number=0
  private fileLength:number=0
  public screenHeight:number=window.innerHeight
  public mericsArray:Array<string>=this.dataServices.productMetrics
  private listOpen:boolean=false
  public chosenMetric:string=""
  public productCategories:any=""
  public currentFile:any=null
  private docPicAdded:boolean=false
  private catId:any=0
  private catPicUploaded:boolean=false
  private prodId: string="";
  private prodUploaded:boolean=false;
  public prouctCategoriesDetails:any=[]
  public predictedCategories:Array<any>=[]
  private chosenCatId:string=""
  private emptyProdValues:boolean=false
  public displayText:string="Display text"
  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.cSFileChooser()
    this.csRFileChooser()
    this.pUTSProductManipulatorHeight()
    this.metricsUnitsDDI()
    this.prevSectBut()
    this.btnNext()
    this.getCategories()
    this.addingCategoriesSectHeight()
    this.catSectBtnNext()
    this.catPrevSectBut()
    this.catFinButton()
    this.productDetailsSubmmiter()
  }

  cSFileChooser():void{
    let cSFileChooser:any=this.eleRef.nativeElement.querySelector(".cSFileChooser")
    if(cSFileChooser!=null){
      this.renderer.listen(cSFileChooser,"click",()=>{
        this.eleRef.nativeElement.querySelector("#csRFileChooser").click()
      })
    }
  }

  csRFileChooser():void{
    let csRFileChooser:any=this.eleRef.nativeElement.querySelector("#csRFileChooser")
    if(csRFileChooser!=null){
      this.renderer.listen(csRFileChooser,"change",evt=>{
        if(this.dataServices.sectionToOpen=="Categories"){
          let addingCategoriesSect:any=this.eleRef.nativeElement.querySelector(".addingCategoriesSect")
          this.renderer.removeClass(addingCategoriesSect,"nosite")
        }else{
          let pUtoolsSect:any=this.eleRef.nativeElement.querySelector(".pUtoolsSect")
          this.renderer.removeClass(pUtoolsSect,"nosite")
        }
        this.chosenFiles=evt.target.files;
        this.fileLength=this.chosenFiles.length-1
        if(this.chosenFiles.length>0){
          this.fileManipilator()
        }
      })
    }
  }

  fileManipilator():void{
    if(this.fileCounter<=this.fileLength){
      let chosenFile:File=this.getFile(this.fileCounter)
      this.productManipulator(chosenFile)
    }
  }
  
  productManipulator(displayfile:File):any{
      let prodImgData=new FileReader()
      prodImgData.onload=()=>{
        let displayfileData:any=prodImgData.result
        this.currentFile=displayfileData

        if(this.dataServices.sectionToOpen=="Categories"){
          let prodCatImg:any=this.eleRef.nativeElement.querySelector(".prodCatImg")
          this.renderer.setProperty(prodCatImg,"src",displayfileData)
        }else{
          let imgMAnProdPic:any=this.eleRef.nativeElement.querySelector(".imgMAnProdPic")
          this.renderer.setProperty(imgMAnProdPic,"src",displayfileData)
        }

        let pUPNewProdPg:any=this.eleRef.nativeElement.querySelector(".pUPNewProdPg")
        this.renderer.addClass(pUPNewProdPg,"nosite")
        
      }
      prodImgData.readAsDataURL(displayfile)
  }

  imgReducer(imgData:any):Promise<Blob>{
    return new Promise((fTSResp,fTSRej)=>{
      let imgToResize:any=new Image()
      let imgholdertest:any=this.eleRef.nativeElement.querySelector(".imgholdertest")
      imgToResize.onload=()=>{ 
        let docImgToResize:any=this.eleRef.nativeElement.querySelector(".imgTosend")
        console.log(imgholdertest,docImgToResize);        
        if(docImgToResize!=null){ 
          this.renderer.removeChild(imgholdertest,docImgToResize)
          this.docPicAdded=false
        }
        let iTRNH:number=imgToResize.naturalHeight
        let iTRNW:number=imgToResize.naturalWidth
        imgToResize.classList="imgTosend"
        let newImgHeight:number=400
        let newImgWidth:number=400
        console.log("img Set up");
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
        console.log(this.docPicAdded); 
        console.log("value");         
        if(this.docPicAdded==false){
          console.log("after condition");  
          this.renderer.appendChild(imgholdertest,imgToResize)
          console.log("img appended");          
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
        },'image/png',0.7)
          this.docPicAdded=true
        }
      }
      imgToResize.src=imgData
    })
  }

  getFile(fileIndex:number):File{
    let chosenFile:File=this.chosenFiles[fileIndex]
    return chosenFile
  }

  pUTSProductManipulatorHeight():void{
    let pUTSProductManipulator=this.eleRef.nativeElement.querySelector(".pUTSProductManipulator")
    if(pUTSProductManipulator!=null){
      this.renderer.setStyle(pUTSProductManipulator,"height",this.screenHeight*0.8+'px')
    }
  }
  addingCategoriesSectHeight():void{
    let addingCategoriesSect=this.eleRef.nativeElement.querySelector(".addingCategoriesSect")
    if(addingCategoriesSect!=null){
      this.renderer.setStyle(addingCategoriesSect,"height",this.screenHeight*0.8+'px')
    }
  }
  metricsUnitsDDI():void{
    let docMetricsUnitsDDI:any=this.eleRef.nativeElement.querySelector(".metricsUnitsDDI")
    let docMUDDIInnerDiv:any=this.eleRef.nativeElement.querySelector(".mUDDIInnerDiv")
    let docMetricsUnitsList:any=this.eleRef.nativeElement.querySelector(".metricsUnitsList")
    this.renderer.listen(docMetricsUnitsDDI,"click",()=>{
      this.rotatorFunc(docMUDDIInnerDiv,docMetricsUnitsList)
    })
  }
  rotatorFunc(docMUDDIInnerDiv:any,docMetricsUnitsList:any):void{
    if(!this.listOpen){
      this.renderer.setStyle(docMUDDIInnerDiv,"transform","rotate(180deg)")
      this.renderer.removeClass(docMetricsUnitsList,"nosite")
      this.renderer.setStyle(docMetricsUnitsList,"width","100px")
      this.listOpen=true
    }else{
      this.renderer.setStyle(docMUDDIInnerDiv,"transform","rotate(360deg)")
      this.renderer.setStyle(docMetricsUnitsList,"width","10px")
      setTimeout(() => {
        this.renderer.addClass(docMetricsUnitsList,"nosite")
      }, 200);
      this.listOpen=false
    }
  }
  listItemClick(evt:any):void{
      this.chosenMetric=evt.target.innerText
      let docMUDDIInnerDiv:any=this.eleRef.nativeElement.querySelector(".mUDDIInnerDiv")
      let docMetricsUnitsList:any=this.eleRef.nativeElement.querySelector(".metricsUnitsList")
      this.rotatorFunc(docMUDDIInnerDiv,docMetricsUnitsList)
  }
  prevSectBut():void{
    let docPrevSectBut:any=this.eleRef.nativeElement.querySelector(".prevSectBut")
    let docImgHolderSect:any=this.eleRef.nativeElement.querySelector(".imgHolderSect")
    let docProductetailsSect:any=this.eleRef.nativeElement.querySelector(".productetailsSect")
    this.renderer.listen(docPrevSectBut,"click",()=>{
      this.renderer.addClass(docProductetailsSect,"nosite")
      this.renderer.removeClass(docImgHolderSect,"nosite")
    })
  }
  btnNext():void{
    let docbtnNext:any=this.eleRef.nativeElement.querySelector(".btnNext")
    let docImgHolderSect:any=this.eleRef.nativeElement.querySelector(".imgHolderSect")
    let docProductetailsSect:any=this.eleRef.nativeElement.querySelector(".productetailsSect")
    this.renderer.listen(docbtnNext,"click",()=>{
      if(!this.prodUploaded){
        this.imgReducer(this.currentFile).then(fTSend=>{
          let prod_details:FormData= new FormData()
          prod_details.append("typeOfUpload","partial")
          prod_details.append("productImg",fTSend)
          prod_details.append("retailerId",this.dataServices.userData.userContact)
          prod_details.append("retailerName",this.dataServices.userData.userName)
          this.backComs.backendCommunicator(prod_details,"post",`${this.backComs.backendBaseLink}/addProd`).then(resp=>{
            this.prodId=resp
            this.prodUploaded=true
            this.renderer.addClass(docImgHolderSect,"nosite")
            this.renderer.removeClass(docProductetailsSect,"nosite")
          }).then(()=>{
            this.dataServices.getProductCategories().then(resp=>{
              this.prouctCategoriesDetails=resp
            })
          })
        })
      }else if(this.prodUploaded){
        this.renderer.addClass(docImgHolderSect,"nosite")
        this.renderer.removeClass(docProductetailsSect,"nosite")
      }
    })
  }
  checkProdInput(inputTexts:any):FormData{
    let emptyTexts:Array<any>=[]
    let filledInputTexts:Array<any>=[]

    inputTexts.forEach((inputText:any) => {
      let inputTextValue:string=inputText.value
      if(inputTextValue==""){
        emptyTexts.push(inputText)
      }else{
        filledInputTexts.push(inputText)
      }
    });
    if(emptyTexts.length<=0){
      this.emptyProdValues=false
      return this.createProdFomData(filledInputTexts)
    }else{
      this.emptyProdValues=true
      return new FormData()
    }
  }
  createProdFomData(inputTexts:any):FormData{
    let prodFormData:FormData=new FormData()
    prodFormData.append("typeOfUpload","full")
    prodFormData.append("partialBarcode",this.prodId)
    inputTexts.forEach((inputText:any) => {
      if(inputText.id=="productMetrics"){
        prodFormData.append(inputText.id,inputText.value+this.chosenMetric)
      }else if(inputText.id=="productCategoryipt"){
        prodFormData.append(inputText.id,this.chosenCatId)
      }else{
        prodFormData.append(inputText.id,inputText.value)
      }
    });
    return prodFormData
  }
  productDetailsSubmmiter():void{
    let docproductDetailsSubmmiter=this.eleRef.nativeElement.querySelector(".productDetailsSubmmiter")
    this.renderer.listen(docproductDetailsSubmmiter,"click",()=>{
      let docProdDetTextInputs:any=this.eleRef.nativeElement.querySelectorAll(".prodDetTextInput")
      let prodFormData:FormData=this.checkProdInput(docProdDetTextInputs)
      if(this.emptyProdValues==false){
        this.backComs.backendCommunicator(prodFormData,"post",`${this.backComs.backendBaseLink}/addProd`).then(resp=>{
            let pUtoolsSect:any=this.eleRef.nativeElement.querySelector(".pUtoolsSect")
            this.renderer.addClass(pUtoolsSect,"nosite")
            let pUPNewProdPg:any=this.eleRef.nativeElement.querySelector(".pUPNewProdPg")
            this.renderer.removeClass(pUPNewProdPg,"nosite")
            let productetailsSect:any=this.eleRef.nativeElement.querySelector(".productetailsSect")
            this.renderer.addClass(productetailsSect,"nosite")
            let imgHolderSect:any=this.eleRef.nativeElement.querySelector(".imgHolderSect")
            this.renderer.removeClass(imgHolderSect,"nosite")
            this.prodUploaded=false
        })
      }else{
        let textToDisplay:string="There are some empty fields."
        this.openFeedBackLoop(textToDisplay)      
      }
    })
  }
  productCategoryipt(evt:any):void{
    let docCategoryAnsDiv=this.eleRef.nativeElement.querySelector(".categoryAnsDiv")    
      this.predictedCategories=[]
      let pCIValue:string=evt.target.value      
      if(pCIValue!=""){
        this.renderer.removeClass(docCategoryAnsDiv,"nosite")
        this.productCategories.forEach((productCategoryDetails:any) => {
          productCategoryDetails.forEach((productCategoryDetail:any) => {
            if(productCategoryDetail!=null){
              let stringedWord:string=productCategoryDetail.toString().toLowerCase()          
              if(stringedWord.includes(pCIValue.toString().toLowerCase())){
                if(!this.predictedCategories.includes(productCategoryDetails))
                this.predictedCategories.push(productCategoryDetails)
              }
            }
          });
        });
        console.log(this.predictedCategories);
        
      }else{
        this.renderer.addClass(docCategoryAnsDiv,"nosite")
      }
  }
  // cADTExit():void{
  //   let docCADTExit:any=this.eleRef.nativeElement.querySelector(".cADTExit")
  //   let docCategoryAnsDiv:any=this.eleRef.nativeElement.querySelector(".categoryAnsDiv")
  //   this.renderer.listen(docCADTExit,"click",()=>{
  //     this.renderer.addClass(docCategoryAnsDiv,"nosite")
  //   })
  // }
  cTResultTab(evt:any){
    let tabDetails:any=evt.target
    this.chosenCatId=tabDetails.id.slice(4)
    let chosenCatName:string=tabDetails.innerText
    let docProductCategoryipt:any=this.eleRef.nativeElement.querySelector("#productCategoryipt")
    docProductCategoryipt.value=chosenCatName
      let docCategoryAnsDiv:any=this.eleRef.nativeElement.querySelector(".categoryAnsDiv")
      this.renderer.addClass(docCategoryAnsDiv,"nosite")
  }
  getCategories():void{
    this.dataServices.getProductCategories().then(resp=>{
      this.productCategories=resp
    })
  }
  catSectBtnNext():void{
    let catSectBtnNext:any=this.eleRef.nativeElement.querySelector(".catSectBtnNext")
    let aCSCatImgHolder:any=this.eleRef.nativeElement.querySelector(".aCSCatImgHolder")
    let catDetailsSect:any=this.eleRef.nativeElement.querySelector(".catDetailsSect")
    this.renderer.listen(catSectBtnNext,"click",()=>{
      console.log(this.catPicUploaded);      
      if(this.catPicUploaded==false){
        console.log(this.catPicUploaded);
        console.log("Calling img reducer");   
        console.log(this.currentFile);        
        this.imgReducer(this.currentFile).then(fTSend=>{
          console.log("called img reducer");   
          let cat_details:FormData= new FormData()
          cat_details.append("typeOfUpload","partial")
          cat_details.append("categoryImg",fTSend)
          this.backComs.backendCommunicator(cat_details,"post",`${this.backComs.backendBaseLink}/addCat`).then(resp=>{
            console.log(resp); 
            this.catId=resp
            this.catPicUploaded=true
            console.log(this.catPicUploaded);   
          })
        }).catch(err=>{
          console.log(err);          
        })
      }
      this.renderer.addClass(aCSCatImgHolder,"nosite")
      this.renderer.removeClass(catDetailsSect,"nosite")
    })
  }
  catPrevSectBut():void{
    let catPrevSectBut:any=this.eleRef.nativeElement.querySelector(".catPrevSectBut")
    let aCSCatImgHolder:any=this.eleRef.nativeElement.querySelector(".aCSCatImgHolder")
    let catDetailsSect:any=this.eleRef.nativeElement.querySelector(".catDetailsSect")
    this.renderer.listen(catPrevSectBut,"click",()=>{
      this.renderer.addClass(catDetailsSect,"nosite")
      this.renderer.removeClass(aCSCatImgHolder,"nosite")
    })
  }
  catFinButton():void{
    let catFinButton:any=this.eleRef.nativeElement.querySelector(".catFinButton")
    this.renderer.listen(catFinButton,"click",()=>{
      let categoryName:any=this.eleRef.nativeElement.querySelector("#categoryName").value
      let cat_details:FormData= new FormData()
      cat_details.append("typeOfUpload","full")
      cat_details.append("categoryName",categoryName)
      cat_details.append("categoryid",this.catId)
      if(categoryName!=""){
        this.backComs.backendCommunicator(cat_details,"post",`${this.backComs.backendBaseLink}/addCat`).then(resp=>{
          console.log(resp); 
          console.log(this.catPicUploaded); 
          this.catPicUploaded=false
          console.log(this.catPicUploaded); 
          let addingCategoriesSect:any=this.eleRef.nativeElement.querySelector(".addingCategoriesSect")
          this.renderer.addClass(addingCategoriesSect,"nosite")
          let pUPNewProdPg:any=this.eleRef.nativeElement.querySelector(".pUPNewProdPg")
          this.renderer.removeClass(pUPNewProdPg,"nosite")
          let catDetailsSect:any=this.eleRef.nativeElement.querySelector(".catDetailsSect")
          this.renderer.addClass(catDetailsSect,"nosite")
          let aCSCatImgHolder:any=this.eleRef.nativeElement.querySelector(".aCSCatImgHolder")
          this.renderer.removeClass(aCSCatImgHolder,"nosite")
        })
      }else{
        let textToDisplay:string="Please fill category name."
        this.openFeedBackLoop(textToDisplay)  
        
      }

    })
  }

  closeFeedbackLoop():void{
    let fBLoop:any=this.eleRef.nativeElement.querySelector(".sWFLMain")
    this.renderer.addClass(fBLoop,"nosite")
  }

  openFeedBackLoop(textToDisplay:string):void{
    this.displayText=textToDisplay
    let fBLoop:any=this.eleRef.nativeElement.querySelector(".sWFLMain")
    this.renderer.removeClass(fBLoop,"nosite")
  }
}
