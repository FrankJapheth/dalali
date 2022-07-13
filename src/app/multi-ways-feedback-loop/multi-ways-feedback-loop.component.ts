import { Component, OnInit, ElementRef, Renderer2, Input } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';

@Component({
  selector: 'app-multi-ways-feedback-loop',
  templateUrl: './multi-ways-feedback-loop.component.html',
  styleUrls: ['./multi-ways-feedback-loop.component.scss']
})
export class MultiWaysFeedbackLoopComponent implements OnInit {

  constructor(
    private eleRef:ElementRef,
    private renderer:Renderer2,
    public dataService:DalalidataService
  ) { }
  
  public rejDisplay:string = ''
  public respDisplay:string=''

  ngOnInit(): void {
  }
  ngAfterViewInit():void{
  }

  closeFeedbackLoop():void{
    let fBLoop:any=this.eleRef.nativeElement.querySelector(".mWFLPage")
    this.renderer.addClass(fBLoop,"nosite")
  }

  openFeedbackLoop(rejDisp?:string,respDisp?:string):Promise<boolean>{
    
    if (rejDisp== undefined){
      rejDisp = 'No'
    }
    if ( respDisp == undefined){
      respDisp='Yes'
    }

    this.rejDisplay=rejDisp
    this.respDisplay=respDisp

    const acceptBut:any = this.eleRef.nativeElement.querySelector(".mWFLPBFABut")
    const denyBut:any = this.eleRef.nativeElement.querySelector(".mWFLPBFCBut")
    let fBLoop:any=this.eleRef.nativeElement.querySelector(".mWFLPage")
    
    return new Promise<boolean>((resolve) => {
      this.renderer.removeClass(fBLoop,"nosite")

      this.renderer.listen(acceptBut,'click',()=>{
        this.renderer.addClass(fBLoop,"nosite")
        resolve(true)
      })

      this.renderer.listen(denyBut,'click',()=>{
        this.renderer.addClass(fBLoop,"nosite")
        resolve(false)
      })
      
    })
  }
  
}
