import { Component, OnInit } from '@angular/core';
import { DalalidataService } from '../service/data/dalalidata.service';
import { BackendcommunicatorService } from '../service/communications/backendcommunicator.service';

@Component({
  selector: 'app-days-product-sold',
  templateUrl: './days-product-sold.component.html',
  styleUrls: ['./days-product-sold.component.scss']
})
export class DaysProductSoldComponent implements OnInit {
  public daysDate: string =this.dataService.daysDate
  public dayRecords:any = null

  constructor(
    private dataService: DalalidataService,
    private backComms: BackendcommunicatorService
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit():void{
    const requestLink: string = `${this.backComms.backendBaseLink}/daysProductsSold`;
    const daysProdSoldForm:FormData=new FormData()
    daysProdSoldForm.append("daysDate",this.daysDate)
    this.backComms.backendCommunicator(daysProdSoldForm,"post",requestLink).then(resp=>{
      this.dayRecords = JSON.parse(resp)
      console.log(this.dayRecords);
      
    });
  }

}
