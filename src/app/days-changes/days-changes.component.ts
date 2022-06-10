import { Component, OnInit } from '@angular/core';
import { DalalidataService } from '../dalalidata.service';
import { BackendcommunicatorService } from '../backendcommunicator.service';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-days-changes',
  templateUrl: './days-changes.component.html',
  styleUrls: ['./days-changes.component.scss']
})
export class DaysChangesComponent implements OnInit {
  public daysDate: any = this.dataService.daysDate
  public dayRecords: any = null
  public changesRecords: any = null
  public changedAttrib: any ={}
  public changesRecordsDict: any = {}
  public fetchedRecords: any = {}
  public opennedTabs: Array<any>=[]
  public fetchedTabs: Array<any>=[]

  constructor(
    private dataService:DalalidataService,
    private backComms:BackendcommunicatorService,
    private eleRef:ElementRef
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit():void{
    const requestLink: string = `${this.backComms.backendBaseLink}/daysChanges`;
    const daysChangesForm:FormData=new FormData()
    daysChangesForm.append("daysDate",this.daysDate)
    this.backComms.backendCommunicator(daysChangesForm,"post",requestLink).then(resp=>{
      this.dayRecords = resp
    });

  }

  getRetailerChanges(evt: any){
    const changeStamp: any = evt.target.id.slice(2)
    const dateOfRecord: any =this.eleRef.nativeElement.querySelector(`#dOCV${String(changeStamp)}`).innerText
    const retailerId: any = this.eleRef.nativeElement.querySelector(`#rIV${String(changeStamp)}`).innerText

    const changesRecodsForm:FormData = new FormData()
    changesRecodsForm.append('retailerId', retailerId)
    changesRecodsForm.append('dateOfRecord',dateOfRecord)

    if (!this.opennedTabs.includes(changeStamp)){
      if(this.fetchedRecords[changeStamp]==undefined){
        const requestLink: string = `${this.backComms.backendBaseLink}/changesRecords`;
        this.backComms.backendCommunicator(changesRecodsForm,"post",requestLink).then(resp=>{
          this.changesRecordsDict[changeStamp]=resp
          this.fetchedRecords[changeStamp]=resp
          this.opennedTabs.push(changeStamp)
          this.fetchedTabs.push(changeStamp)
          evt.target.innerText = "Close Records"
        });
      }else{
        this.changesRecordsDict[changeStamp]=this.fetchedRecords[changeStamp]
        this.opennedTabs.push(changeStamp)
        evt.target.innerText = "Close Records"
      }

    }else{
      this.opennedTabs.splice(this.opennedTabs.indexOf(changeStamp), 1)
      this.changesRecordsDict[changeStamp]=undefined
      evt.target.innerText = "View Records"
    }
    
  }

  parseAttribValue(evt: any): void { 
    if (this.changedAttrib[evt.target.id.slice(2)] == undefined){
      const valuesToPass: any = this.eleRef.nativeElement.querySelector(
        `#aD${evt.target.id.slice(2)}`
      ).value
      if(valuesToPass!=""){
        const passedValues: any = JSON.parse(valuesToPass)
        this.changedAttrib[evt.target.id.slice(2)]=passedValues
        evt.target.innerText = "Close records"
      }else{
        alert("Not Recorded")
      }
    }else{
      this.changedAttrib[evt.target.id.slice(2)]=undefined
      evt.target.innerText = "View records"
    }
  }

}
