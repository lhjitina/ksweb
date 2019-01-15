import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import * as Global from './../../globalvar';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Contract } from '../contract/contract.component';
import { RespPage, RespData, PageRequest } from './../../common/dto';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-contractmanagement',
  templateUrl: './contractmanagement.component.html',
  styleUrls: ['./contractmanagement.component.css']
})
export class ContractmanagementComponent implements OnInit {
  contracts: Contract[] = [];
  states: string[] = Global.DOCSTATS;
  searchFormGroup: FormGroup;
  uploadFormGroup: FormGroup;

  uploader:FileUploader;
  bShowUplodModal: boolean = false;
  bHasClicked: boolean = false;

  confirmModal: NzModalRef; 

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private er: ElementRef,
              private modal: NzModalService,
              private gs: GlobalService) {
    this.searchFormGroup = this.fb.group({
      name: [''],
      startDate: [''],
      endDate: [''],
      state: [Global.DOCSTAT_ACTIVE]
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
    var page = new PageRequest();  
    var sd = this.searchFormGroup.get("startDate").value;
    var ed = this.searchFormGroup.get("endDate").value;
    if (moment.isDate(sd)) { 
      page.append("startDate", moment(sd).format("YYYY-MM-DD")) 
    };
    if (moment.isDate(ed)) { 
      page.append("endDate", moment(ed).format("YYYY-MM-DD")) 
    };
    page.append("name", this.searchFormGroup.get("name").value);
    page.append("state", this.searchFormGroup.get("state").value);

    this.http.post("/api/console/contract/list", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.contracts = res.data;        
      }
      else{
        console.log(res.message);
        this.contracts = [];
      }
    })
  }

  initUploader(): void{
    this.uploader = new FileUploader({});
    this.uploader.onCompleteAll=()=>{
      this.bShowUplodModal = false;
      this.uploader.clearQueue();
      this.er.nativeElement.querySelector(".reg-upload").value='';
      this.onSearch();
    }
  }

  setUploadParams(): void{
    var upUrl = "/api/contract/upload?issueDate=";
    var issueDate = moment(this.uploadFormGroup.get("issueDate").value).format("YYYY-MM-DD");
    upUrl = upUrl + issueDate;
    this.uploader.setOptions({
      url: upUrl,
      authToken: this.gs.getToken(),
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
        body.state = Global.DOCSTAT_ABATED;
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
        body.state = Global.DOCSTAT_ACTIVE;
        this.http.post("/api/contract/state", body).subscribe((res: any)=>{
          this.onSearch();
        });
      }
   });
  } 

}

