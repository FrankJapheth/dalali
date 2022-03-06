import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { BackendcommunicatorService } from '../backendcommunicator.service';

@Component({
  selector: 'app-super-user',
  templateUrl: './super-user.component.html',
  styleUrls: ['./super-user.component.scss']
})
export class SuperUserComponent implements OnInit {
  constructor(
    private eleRef:ElementRef,
    private renderer:Renderer2,
    private dataService:DalalidataService,
    private backendComms:BackendcommunicatorService,
  ) { }
  public maintainanceTypes:Array<string>=this.dataService.systemRepairTypes
  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.adiminButton()
    this.adminControllersCancelBut()
    this.adminControllersDoneBut()  
    this.systemMaintanancePopUp()
    this.systemMantainanceBut()
    this.systemMaintainanceHeadCancelBut()
    this.headClose()
    this.systemMaintainanceHeadDoneBut()
  }
  adiminButton(){
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".addAdminBut"),"click",()=>{
      this.dataService.typeOfSelectedUserSearch="admin"
      this.renderer.addClass(this.eleRef.nativeElement.querySelector(".systeMaintananceSect"),"nosite")
      this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".adminSetterDiv"),"nosite")
      this.renderer.addClass(this.eleRef.nativeElement.querySelector(".superUserBody"),"nosite")
      this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".superUserControlsDiv"),"nosite")
    })
  }
  adminControllersCancelBut(){
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".adminControllersCancelBut"),"click",()=>{
      this.dataService.typeOfSelectedUserSearch=""
      this.renderer.addClass(this.eleRef.nativeElement.querySelector(".adminSetterDiv"),"nosite")
      this.renderer.addClass(this.eleRef.nativeElement.querySelector(".superUserControlsDiv"),"nosite")
      this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".systeMaintananceSect"),"nosite")
      this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".superUserBody"),"nosite")
    })    
  }
  adminControllersDoneBut(){
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".adminControllersDoneBut"),"click",()=>{
      let usersData:FormData=new FormData()
      usersData.append("typeToChange",this.dataService.typeOfSelectedUserSearch)
      usersData.append("selectedUsers",JSON.stringify(this.dataService.selectedUsers))
      this.backendComms.backendCommunicator(usersData,"post",`${this.backendComms.backendBaseLink}/changeUserType`).then(resp=>{
        console.log(resp);
        this.renderer.addClass(this.eleRef.nativeElement.querySelector(".adminSetterDiv"),"nosite")
        this.renderer.addClass(this.eleRef.nativeElement.querySelector(".superUserControlsDiv"),"nosite")
        this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".systeMaintananceSect"),"nosite")
        this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".superUserBody"),"nosite")
      })
    })       
  }
  systemMantainanceBut(){
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".systemMantainanceBut"),"click",()=>{
      this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".systemMaintanancePopUp"),"nosite")
    })
  }
  systemMaintanancePopUp(){
    this.renderer.setStyle(this.eleRef.nativeElement.querySelector(".systemMaintanancePopUp"),"height",window.innerHeight+'px')
  }
  headClose(){
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".headClose"),"click",()=>{
      this.dataService.typeOfRepair=""
      this.renderer.addClass(this.eleRef.nativeElement.querySelector(".systemMaintanancePopUp"),"nosite")
    })
  }
  systemMaintainanceTypeButs(evt:any):void{
    this.dataService.typeOfRepair=evt.target.innerText
    this.renderer.addClass(this.eleRef.nativeElement.querySelector(".systemMaintanancePopUp"),"nosite")
    this.renderer.addClass(this.eleRef.nativeElement.querySelector(".adminSetterDiv"),"nosite")
    this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".systeMaintananceSect"),"nosite")
    this.renderer.addClass(this.eleRef.nativeElement.querySelector(".superUserBody"),"nosite")
    this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".superUserControlsDiv"),"nosite")
  }
  systemMaintainanceHeadCancelBut(){
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".systemMaintainanceHeadCancelBut"),"click",()=>{
      this.dataService.typeOfRepair=""
      this.renderer.addClass(this.eleRef.nativeElement.querySelector(".systeMaintananceSect"),"nosite")
      this.renderer.addClass(this.eleRef.nativeElement.querySelector(".superUserControlsDiv"),"nosite")
      this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".superUserBody"),"nosite")
    })    
  }
  systemMaintainanceHeadDoneBut(){
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".systemMaintainanceHeadDoneBut"),"click",()=>{
      let usersData:FormData=new FormData()
      usersData.append("maintainanceType",this.dataService.typeOfRepair)
      usersData.append("links",JSON.stringify(this.dataService.selectedLinks))
      this.backendComms.backendCommunicator(usersData,"post",`${this.backendComms.backendBaseLink}/siteMaintinance`).then(resp=>{
        this.renderer.addClass(this.eleRef.nativeElement.querySelector(".adminSetterDiv"),"nosite")
        this.renderer.addClass(this.eleRef.nativeElement.querySelector(".superUserControlsDiv"),"nosite")
        this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".systeMaintananceSect"),"nosite")
        this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".superUserBody"),"nosite")
      })
    })       
  }
}
