import { Component, OnInit } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  constructor(
    private dalaliData:DalalidataService,
  ) { }
  
    public userType:string=this.dalaliData.getUserBasiInfo()[2]

  ngOnInit(): void {    
  }

}
