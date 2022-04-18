import { Component, OnInit,Renderer2,ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-single-way-feedback-loop',
  templateUrl: './single-way-feedback-loop.component.html',
  styleUrls: ['./single-way-feedback-loop.component.scss']
})
export class SingleWayFeedbackLoopComponent implements OnInit {

  constructor(
    private eleRef:ElementRef,
    private renderer:Renderer2
  ) { }

  @Input() displayText:any
  @Input() classType:any

  ngOnInit(): void {
  }
  ngAfterViewInit():void{
  }

  closeFeedbackLoop():void{
    let fBLoop:any=this.eleRef.nativeElement.querySelector(".sWFLMain")
    this.renderer.addClass(fBLoop,"nosite")
  }

}
