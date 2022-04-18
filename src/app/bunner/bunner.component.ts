import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-bunner',
  templateUrl: './bunner.component.html',
  styleUrls: ['./bunner.component.scss']
})
export class BunnerComponent implements OnInit {

  constructor(
    private eleRef:ElementRef,
    private renderer:Renderer2
  ) { }
  
  private clickImage:number=1
  ngOnInit(): void {
  }

  ngAfterViewInit():void{
    this.bunnerMover()
  }
  bunnerMover():any{
    let intId:any=setInterval(()=>{this.bunnerClicker()},5000)
    console.log(intId);
    
  }
  bunnerClicker():any{  
    this.eleRef.nativeElement.querySelector(`#song-${this.clickImage}`).click()
    let prevId:number=1
    let nextId:number=3

    if(this.clickImage==3){
      prevId=this.clickImage-1
      nextId= 1
    }else if(this.clickImage==2){
      prevId=this.clickImage-1
      nextId= this.clickImage+1
    }else if(this.clickImage==1){
      prevId=3
      nextId= this.clickImage+1
    }

    // let timerDivToProcess:any=this.eleRef.nativeElement.querySelector(`#timer${this.clickImage}`)
    // let nextDiv:any=this.eleRef.nativeElement.querySelector(`#timer${nextId}`)
    // let prevDiv:any=this.eleRef.nativeElement.querySelector(`#timer${prevId}`)

    // this.renderer.removeClass(timerDivToProcess,"nosite")
    // this.renderer.addClass(nextDiv,"nosite")
    // this.renderer.addClass(prevDiv,"nosite")
    if(this.clickImage<3){
      this.clickImage+=1
    }else{
      this.clickImage=1
    }
  }
}
