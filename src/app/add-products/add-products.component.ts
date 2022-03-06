import { Component, OnInit,ElementRef,Renderer2 } from '@angular/core';
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
    private renderer:Renderer2
  ) { }
  
  public uploadType:string=this.dataServices.uploadType
  private chosenFiles:Array<File>=[]
  private fileCounter:number=0
  private fileLength:number=0
  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.cSFileChooser()
    this.csRFileChooser()
  }

  cSFileChooser():void{
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".cSFileChooser"),"click",()=>{
      this.eleRef.nativeElement.querySelector("#csRFileChooser").click()
    })
  }

  csRFileChooser():void{
    this.renderer.listen(this.eleRef.nativeElement.querySelector("#csRFileChooser"),"change",evt=>{
      this.chosenFiles=evt.target.files;
      this.fileLength=this.chosenFiles.length-1
      if(this.chosenFiles.length>0){
        this.fileManipilator()
      }
    })
  }

  fileManipilator():void{
    if(this.fileCounter<=this.fileLength){
      let chosenFile:File=this.getFile(this.fileCounter)
      console.log(chosenFile);
      this.fileCounter+=1
      this.fileManipilator()
    }
  }

  getFile(fileIndex:number):File{
    let chosenFile:File=this.chosenFiles[fileIndex]
    return chosenFile
  }
  
}
