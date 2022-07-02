import { Component, OnInit } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  constructor(
    private dalaliData:DalalidataService,
  ) { }
  
    public userData:any=this.dalaliData.getUserBasiInfo()
    public userType:string= this.userData.userType

  ngOnInit(): void {    
  }

}
