import { Component, OnInit, ElementRef, Renderer2, Input } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';

@Component({
  selector: 'app-multi-ways-feedback-loop',
  templateUrl: './multi-ways-feedback-loop.component.html',
  styleUrls: ['./multi-ways-feedback-loop.component.scss']
})
export class MultiWaysFeedbackLoopComponent implements OnInit {

  constructor(
    private eleRef:ElementRef,
    private renderer:Renderer2,
    private dataService:DalalidataService
  ) { }

  @Input() displayText:any

  ngOnInit(): void {
  }
  ngAfterViewInit():void{
    let fBLoop:any=this.eleRef.nativeElement.querySelector(".mWFLPage")
    this.renderer.removeClass(fBLoop,"nosite")    
  }

  closeFeedbackLoop():void{
    let fBLoop:any=this.eleRef.nativeElement.querySelector(".mWFLPage")
    this.renderer.addClass(fBLoop,"nosite")
  }
  acceptAndClose():void{
    this.dataService.mWFLAns=true
    this.closeFeedbackLoop()
  }
  

}
