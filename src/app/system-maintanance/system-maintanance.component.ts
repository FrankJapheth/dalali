import { Component, OnInit,ElementRef,Renderer2 } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { DalalidataService } from '../dalalidata.service';

@Component({
  selector: 'app-system-maintanance',
  templateUrl: './system-maintanance.component.html',
  styleUrls: ['./system-maintanance.component.scss']
})
export class SystemMaintananceComponent implements OnInit {
  public routsToDisplay:Array<string>=[]
  private styledButs:Array<any>=[]
  constructor(
    private appRoutes:AppRoutingModule,
    private eleRef:ElementRef,
    private renderer:Renderer2,
    private dataService:DalalidataService
  ) { }

  ngOnInit(): void {
    this.appRoutesFunc()
  }
  appRoutesFunc(){
    for (let index = 0; index < this.appRoutes.exportedRoutes.length; index++) {
      const dalaliRout:any = this.appRoutes.exportedRoutes[index];
      if(dalaliRout.path!=""){
        this.routsToDisplay.push(dalaliRout.path) 
      }   
    } 
  }
  linkButton(evt:any):void{    
    let searchTablet:any=evt.target
    if(this.styledButs.includes(searchTablet)==false){
      this.renderer.setStyle(searchTablet,"backgroundColor","#121420");    
      this.renderer.setStyle(searchTablet,"color","#fff"); 
      this.dataService.selectedLinks.push(searchTablet.innerText)
      this.styledButs.push(searchTablet)      
    }else{
      this.renderer.setStyle(searchTablet,"color","#121420");    
      this.renderer.setStyle(searchTablet,"backgroundColor","#fff");       
      this.styledButs.splice(this.styledButs.indexOf(searchTablet),1)
      this.dataService.selectedLinks.splice(this.dataService.selectedLinks.indexOf(searchTablet.innerText),1)
    } 
  }

}
