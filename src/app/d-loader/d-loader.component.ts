import { Component, OnInit } from '@angular/core';

import { DalalidataService } from '../service/data/dalalidata.service';

@Component({
  selector: 'app-d-loader',
  templateUrl: './d-loader.component.html',
  styleUrls: ['./d-loader.component.scss']
})
export class DLoaderComponent implements OnInit {



  constructor(
    dataService:DalalidataService
  ) { }

  ngOnInit(): void {
  }

}
