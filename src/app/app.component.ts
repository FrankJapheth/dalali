import { Component,ElementRef, Renderer2, OnInit, AfterViewInit } from '@angular/core';
import { DalalidataService } from './dalalidata.service';
import { DalaliSessionStorageService } from './dalali-session-storage.service';
import { Router } from '@angular/router';
import { SwUpdate } from "@angular/service-worker";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterViewInit{
  title = 'dalali';
  private windowWidth:any=window.innerWidth
  constructor(
    private eleRef:ElementRef,
    private dataService:DalalidataService,
    private renderer:Renderer2,
    private dalaliSession:DalaliSessionStorageService,
    private dalaliRouter:Router,
    private swUpdate: SwUpdate
  ) {}
  public displayText:string="Display Text"

  ngOnInit(): void { 
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(() => {
        if (confirm("A New version of site is available. Load New Version?")) {
          window.location.reload();
        }
      });
    }
  };

  ngAfterViewInit(){
    this.getOffsetTop()
    this.checkSessionLogIn()
    
  }

  getOffsetTop():void{
    let pagesHoder:any=this.eleRef.nativeElement.querySelector(".pagesHoder")
    let pagesHoderTop:any=pagesHoder.offsetTop
    this.dataService.holderOffsetTop=pagesHoderTop   
  }
  redirect(){
    this.eleRef.nativeElement.querySelector(".homeLinkSignIn").click()    
  }
  
  openNavBar():void{
    let docNavHolder:any=this.eleRef.nativeElement.querySelector(".linDiv")
    this.renderer.setStyle(docNavHolder,"display","flex")
    setTimeout(() => {        
      let docNavBar:any=this.eleRef.nativeElement.querySelector(".linkList")
      this.renderer.setStyle(docNavBar,"left","10%")
    }, 100);
  }
  closeNavBar():void{
    if(this.windowWidth<800){
      let docNavBar:any=this.eleRef.nativeElement.querySelector(".linkList")
      this.renderer.setStyle(docNavBar,"left","-100%")
      setTimeout(() => {    
        let docNavHolder:any=this.eleRef.nativeElement.querySelector(".linDiv")
        this.renderer.setStyle(docNavHolder,"display","none")    
      }, 330);
    }

  }
  checkSessionLogIn():void{
    const rawSessionLogIn: any = sessionStorage.getItem('sessionLogIn')
    if(rawSessionLogIn === null || this.dalaliSession.sessionLogIn===false){
      this.dalaliSession.sessionLogIn=false
      sessionStorage.setItem('sessionLogIn',JSON.stringify(this.dalaliSession.sessionLogIn))
      this.dalaliRouter.navigateByUrl('')
    }else{
      this.dalaliSession.sessionLogIn=JSON.parse(rawSessionLogIn)
    }
  }
}
