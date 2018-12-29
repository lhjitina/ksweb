import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import * as globalvar from './../../globalvar';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Contract } from '../contract/contract.component';

@Component({
  selector: 'app-contractmanagement',
  templateUrl: './contractmanagement.component.html',
  styleUrls: ['./contractmanagement.component.css']
})
export class ContractmanagementComponent implements OnInit {
  contracts: Contract[] = [];
  states: string[] = globalvar.DOCSTATS;
  searchFormGroup: FormGroup;
  uploadFormGroup: FormGroup;

  uploader:FileUploader;
  bShowUplodModal: boolean = false;
  bHasClicked: boolean = false;

  confirmModal: NzModalRef; 

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private er: ElementRef,
              private modal: NzModalService) {
    this.searchFormGroup = this.fb.group({
      name: [''],
      startDate: [''],
      endDate: [''],
      state: [globalvar.DOCSTAT_ACTIVE]
    });

    this.uploadFormGroup = this.fb.group({
      issueDate: ['', Validators.required]
    });
  }

  ngOnInit() {    
    this.onSearch();
    this.initUploader();
   }

  onSearch(): void{
    var sd = this.searchFormGroup.get("startDate").value;
    var ed = this.searchFormGroup.get("endDate").value;
    moment.isDate(sd) ? sd = moment(sd).format("YYYY-MM-DD") : sd = "";
    moment.isDate(ed) ? ed = moment(ed).format("YYYY-MM-DD") : ed = "";
    console.log("get contract /api/console/contract/list");
    this.http.get("/api/console/contract/list", {
      params: {
        name: this.searchFormGroup.get("name").value,
        state: this.searchFormGroup.get("state").value,
        startDate: sd,
        endDate: ed
      }
    }).subscribe((res: any)=>{
      if(res==null){
        this.contracts = [];
      }
      else{
        this.contracts = res;
      }
    })
  }

  initUploader(): void{
    this.uploader = new FileUploader({});
    this.uploader.onCompleteAll=()=>{
      this.bShowUplodModal = false;
      this.uploader.clearQueue();
      this.er.nativeElement.querySelector(".reg-upload").value='';
      this.getAll();
    }
  }

  setUploadParams(): void{
    var upUrl = "/api/contract/upload?issueDate=";
    var issueDate = moment(this.uploadFormGroup.get("issueDate").value).format("YYYY-MM-DD");
    upUrl = upUrl + issueDate;
   this.uploader.setOptions({
      url: upUrl,
      removeAfterUpload: true, 
      maxFileSize: 102400000,
      method: "POST"    
    })
  }

  onUpload(): void{
    console.log("upload ....")
    this.uploader.clearQueue();
    let e = this.er.nativeElement.querySelector(".reg-upload");
    e.click();
    this.bHasClicked = false;
  }

  selectFileChange(event: any): void{
    console.log("111111")
    if (this.uploader.queue.length>0){
      this.bShowUplodModal = true;
    }
  }

  nzOnCancel():void{
    this.bShowUplodModal = false;
    this.uploader.cancelAll();
    this.uploader.clearQueue(); 
    this.er.nativeElement.querySelector(".reg-upload").value='';
  }

  nzOnOk(): void{
    if (this.uploadFormGroup.valid){
      this.setUploadParams();
      this.uploader.uploadAll();
      this.bHasClicked = true;
    }
  }

  onAbate(contract: Contract): void{
    this.confirmModal = this.modal.confirm({
      nzTitle: '您确定要作废该模版吗？',
      nzContent: contract.name,
      nzOnOk: () =>{
        var body = Contract.clone(contract);
        body.state = globalvar.DOCSTAT_ABATED;
        this.http.post("/api/contract/state", body).subscribe((res: any)=>{
          this.onSearch();
        });
      }
   });
  }

  onActive(contract: Contract): void{
    this.confirmModal = this.modal.confirm({
      nzTitle: '您确定要生效该模版吗？',
      nzContent: contract.name,
      nzOnOk: () =>{
        var body = Contract.clone(contract);
        body.state = globalvar.DOCSTAT_ACTIVE;
        this.http.post("/api/contract/state", body).subscribe((res: any)=>{
          this.onSearch();
        });
      }
   });
  } 

  getAll(): void{
    this.http.get("/api/console/contract/list").subscribe((res: any)=>{
      this.contracts = res;
    });
  }

 
}

