import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';

@Component({
  selector: 'app-system-maintanance',
  templateUrl: './system-maintanance.component.html',
  styleUrls: ['./system-maintanance.component.scss']
})
export class SystemMaintananceComponent implements OnInit {
  public routsToDisplay:Array<string>=[]
  constructor(
    private appRoutes:AppRoutingModule,
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

}
