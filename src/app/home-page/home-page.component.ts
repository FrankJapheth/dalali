import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  private windowHeight:number=window.innerHeight
  constructor(
    private dalaliData:DalalidataService,
    private elRef:ElementRef,
    private renderer:Renderer2
  ) { }
  public prodCats:any=[]

  ngOnInit(): void {
    this.getProductCat()
  }
  ngAfterViewInit(){    
    if(this.dalaliData.getUserDOB()=="not set"){
      this.renderer.setStyle(this.elRef.nativeElement.querySelector('.ageLimiter'),'height',`${this.windowHeight}px`)
      this.renderer.removeClass(this.elRef.nativeElement.querySelector('.ageLimiter'),'nosite')
      this.checkDetails()
    }
  }
  redirect(){
    this.elRef.nativeElement.querySelector(".homeLink").click()    
  }
  checkDetails(){
    let otpDetails:any=localStorage.getItem("userOTPItems")
    if(otpDetails!=null){
      this.redirect()
    }
  }
  getProductCat():void{
    this.dalaliData.getProductCategories().then(resp=>{
      this.prodCats=resp  
    })
  }

}
