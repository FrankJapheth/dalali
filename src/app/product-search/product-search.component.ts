import { Component, OnInit } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { BackendcommunicatorService } from '../backendcommunicator.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {

  constructor(
    private dataService:DalalidataService,
    private backendComms:BackendcommunicatorService
  ) { }

  ngOnInit(): void {
  }
  productSearchInput(evt:any):void{
    let searchValue:string=evt.target.value
    if(searchValue!=""){
      let searchForm:FormData=new FormData()
      searchForm.append("prodIdentity",searchValue)
      this.backendComms.backendCommunicator(searchForm,"post",`${this.backendComms.backendBaseLink}/searchProds`).then(resp=>{
        console.log(resp);
      })
    }
  }
}
