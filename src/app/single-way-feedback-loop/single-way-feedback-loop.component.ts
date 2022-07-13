import { Component, OnInit,Renderer2,ElementRef } from '@angular/core';

import { DalalidataService } from '../service/data/dalalidata.service';

@Component({
  selector: 'app-single-way-feedback-loop',
  templateUrl: './single-way-feedback-loop.component.html',
  styleUrls: ['./single-way-feedback-loop.component.scss']
})
export class SingleWayFeedbackLoopComponent implements OnInit {

  constructor(
    private eleRef:ElementRef,
    private renderer:Renderer2,
    public dataService:DalalidataService
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit():void{
  }

  closeFeedbackLoop():void{
    let fBLoop:any=this.eleRef.nativeElement.querySelector(".sWFLMain")
    this.renderer.addClass(fBLoop,"nosite")
  }

  openFeedbackLoop():Promise<boolean>{
    const acceptBut:any = this.eleRef.nativeElement.querySelector(".sWFLFCloseAns")
    let fBLoop:any=this.eleRef.nativeElement.querySelector(".sWFLMain")
    this.renderer.removeClass(fBLoop,"nosite")
    return new Promise<boolean>((resolve) => {
      this.renderer.listen(acceptBut,'click',()=>{
        this.renderer.addClass(fBLoop,"nosite")
        resolve(true)
      })
      
    })
  }

}
