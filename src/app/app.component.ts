import { Component,ElementRef } from '@angular/core';
import { DalalidataService } from './dalalidata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dalali';
  constructor(
    private eleRef:ElementRef,
    private dataService:DalalidataService
  ) {}

  ngAfterViewInit(){
    this.getOffsetTop()
  }

  getOffsetTop():void{
    let pagesHoder:any=this.eleRef.nativeElement.querySelector(".pagesHoder")
    let pagesHoderTop:any=pagesHoder.offsetTop
    this.dataService.holderOffsetTop=pagesHoderTop   
  }
}
