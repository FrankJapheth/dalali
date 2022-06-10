import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-bunner',
  templateUrl: './bunner.component.html',
  styleUrls: ['./bunner.component.scss']
})
export class BunnerComponent implements OnInit {

  constructor(
    private eleRef:ElementRef
  ) { }
  
  private clickImage:number=1
  ngOnInit(): void {
  }

  ngAfterViewInit():void{
    this.bunnerMover()
  }
  bunnerMover():any{
    setInterval(()=>{this.bunnerClicker()},5000);
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
    if(this.clickImage<3){
      this.clickImage+=1
    }else{
      this.clickImage=1
    }
    return [prevId,nextId]
  }
}
