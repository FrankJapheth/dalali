import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {
  public usersInfo:Array<string>=[]
  private styleSetTabs:Array<any>=[]
  constructor(
    private eleRef:ElementRef,
    private renderer:Renderer2,
    private dataService:DalalidataService,
  ) { }

  ngOnInit(): void {
  }

  getSearchedUsers(evt:any):void{
    let userSearchFormData:FormData=new FormData()
    let inputValue:string=evt.target.value
    let presentTabs:any=this.eleRef.nativeElement.querySelectorAll(".searchResultTablet")
    if(presentTabs.length>0){
      presentTabs.forEach((presentTab:any) => {
        presentTab.remove()
      });
    }
    if(inputValue!=""){
      userSearchFormData.append("userIdentity",inputValue)
      this.dataService.getUsers(userSearchFormData).then((resp:any)=>{
        for (let index = 0; index < resp.length; index++) {
          this.usersInfo.push(resp[index])     
        } 
      })
    }
  }
  searchResultTablet(evt:any):void{    
    let searchTablet:any=this.eleRef.nativeElement.querySelector(`#sRT${evt.target.id.slice(4)}`)
    if(this.styleSetTabs.includes(searchTablet)==false){
      this.renderer.setStyle(searchTablet,"backgroundColor","#121420");    
      this.renderer.setStyle(searchTablet,"color","#fff"); 
      this.dataService.selectedUsers.push(this.eleRef.nativeElement.querySelector(`#sRUC${evt.target.id.slice(4)}`).innerText)
      this.styleSetTabs.push(searchTablet)      
    }else{
      this.renderer.setStyle(searchTablet,"color","#121420");    
      this.renderer.setStyle(searchTablet,"backgroundColor","#fff");       
      this.styleSetTabs.splice(this.styleSetTabs.indexOf(searchTablet),1)
      this.dataService.selectedUsers.splice(this.dataService.selectedUsers.indexOf(this.eleRef.nativeElement.querySelector(`#sRUC${evt.target.id.slice(4)}`).innerText),1)
    }
    console.log(this.dataService.selectedUsers);    
  }

}
