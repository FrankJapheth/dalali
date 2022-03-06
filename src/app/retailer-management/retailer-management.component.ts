import { Component, OnInit,ElementRef,Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { BackendcommunicatorService } from '../backendcommunicator.service';

@Component({
  selector: 'app-retailer-management',
  templateUrl: './retailer-management.component.html',
  styleUrls: ['./retailer-management.component.scss']
})
export class RetailerManagementComponent implements OnInit {

  constructor(
    private eleRef:ElementRef,
    private renderer:Renderer2,
    private dataService:DalalidataService,
    private backendComms:BackendcommunicatorService,    
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.addRtailer()
    this.removeRtailer()
    this.setOrRemoveRetailerControllersCancelBut()
    this.setOrRemoveRetailerControllersDoneBut()
  }
  addRtailer():void{
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".addRtailer"),"click",()=>{
      this.dataService.typeOfSelectedUserSearch="retailer"
      this.renderer.addClass(this.eleRef.nativeElement.querySelector(".rMPBody"),"nosite")
      this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".rMPControls"),"nosite")
      this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".setOrRemoveRetailer"),"nosite")
    })
  }
  removeRtailer():void{
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".removeRtailer"),"click",()=>{
      this.dataService.typeOfSelectedUserSearch="buyer"
      this.renderer.addClass(this.eleRef.nativeElement.querySelector(".rMPBody"),"nosite")
      this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".rMPControls"),"nosite")
      this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".setOrRemoveRetailer"),"nosite")
    })
  }
  setOrRemoveRetailerControllersCancelBut():void{
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".setOrRemoveRetailerControllersCancelBut"),"click",()=>{
      this.dataService.typeOfSelectedUserSearch=""
      this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".rMPBody"),"nosite")
      this.renderer.addClass(this.eleRef.nativeElement.querySelector(".rMPControls"),"nosite")
      this.renderer.addClass(this.eleRef.nativeElement.querySelector(".setOrRemoveRetailer"),"nosite")
    })
  }
  setOrRemoveRetailerControllersDoneBut():void{
    this.renderer.listen(this.eleRef.nativeElement.querySelector(".setOrRemoveRetailerControllersDoneBut"),"click",()=>{
      let usersData:FormData=new FormData()
      usersData.append("typeToChange",this.dataService.typeOfSelectedUserSearch)
      usersData.append("selectedUsers",JSON.stringify(this.dataService.selectedUsers))
      this.backendComms.backendCommunicator(usersData,"post",`${this.backendComms.backendBaseLink}/changeUserType`).then(resp=>{
        console.log(resp);
        this.renderer.removeClass(this.eleRef.nativeElement.querySelector(".rMPBody"),"nosite")
        this.renderer.addClass(this.eleRef.nativeElement.querySelector(".rMPControls"),"nosite")
        this.renderer.addClass(this.eleRef.nativeElement.querySelector(".setOrRemoveRetailer"),"nosite")
      })
    })    
  }
}