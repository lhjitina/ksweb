import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import * as moment from 'moment';
import * as globalvar from './../../globalvar';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { PartnerDoc } from './../pdoc/pdoc.component';

@Component({
  selector: 'app-pdocmanagement',
  templateUrl: './pdocmanagement.component.html',
  styleUrls: ['./pdocmanagement.component.css']
})
export class PdocmanagementComponent implements OnInit {

  pdocs: PartnerDoc[] = [];
  states: string[] = globalvar.DOCSTATS;
  searchFormGroup: FormGroup;
  uploadFormGroup: FormGroup;
  uploader:FileUploader;
  bShowUplodModal: boolean = false;
  bHasClicked: boolean = false;

  confirmModal: NzModalRef; 

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private modal: NzModalService) {
    this.searchFormGroup = this.fb.group({
      name: [''],
      partner: ['']
    });

    this.uploadFormGroup = this.fb.group({
      partner: ['', Validators.required]
    });

  }

  ngOnInit() {    
    this.onSearch();
    this.initUploader();
   }

  onSearch(): void{
    console.log("get pdoc /api/console/pdoc/list");
    this.http.get("/api/console/pdoc/list", {
      params: {
        name: this.poliSearchFormGroup.get("name").value,
        institution: this.poliSearchFormGroup.get("institution").value,
        startDate: sd,
        endDate: ed,
        state: this.poliSearchFormGroup.get("state").value
      }
    }).subscribe((res: any)=>{
      if(res==null){
        this.policies = [];
      }
      else{
        this.policies = res;
      }
    })
  }

  initUploader(): void{
    this.poliUploader = new FileUploader({});
    this.poliUploader.onCompleteAll=()=>{
      this.bShowUplodModal = false;
      this.poliUploader.clearQueue();
      this.er.nativeElement.querySelector(".reg-upload").value='';
      this.getAll();
    }
  }

  setUploadParams(): void{
    var upUrl = "/api/policy/upload?institution=" + this.poliUploadFormGroup.get("institution").value;
    var issueDate = moment(this.poliUploadFormGroup.get("issueDate").value).format("YYYY-MM-DD");
    upUrl = upUrl + "&issueDate=" + issueDate;

    this.poliUploader.setOptions({
      url: upUrl,
      removeAfterUpload: true, 
      maxFileSize: 102400000,
      method: "POST"    
    })
  }

  onUpload(): void{
    this.poliUploader.clearQueue();
    let e = this.er.nativeElement.querySelector(".reg-upload");
    e.click();
    this.bHasClicked = false;
  }

  selectFileChange(event: any): void{
    console.log("111111")
    if (this.poliUploader.queue.length>0){
      this.bShowUplodModal = true;
    }
  }

  nzOnCancel():void{
    this.bShowUplodModal = false;
    this.poliUploader.cancelAll();
    this.poliUploader.clearQueue(); 
    this.er.nativeElement.querySelector(".reg-upload").value='';
  }

  nzOnOk(): void{
    if (this.poliUploadFormGroup.valid){
      this.setUploadParams();
      this.poliUploader.uploadAll();
      this.bHasClicked = true;
    }
    else{
      console.log("....upload param error.....")
    }
  }

  onAbate(policy: Policy): void{
    this.confirmModal = this.modal.confirm({
      nzTitle: '您确定要作废该文件吗？',
      nzContent: policy.name,
      nzOnOk: () =>{
        var body = Policy.clone(policy);
        body.state = globalvar.DOCSTAT_ABATED;
        this.http.post("/api/policy/state", body).subscribe((res: any)=>{
          this.onSearch();
        });
      }
   });
  }

  onActive(policy: Policy): void{
    this.confirmModal = this.modal.confirm({
      nzTitle: '您确定要生效该文件吗？',
      nzContent: policy.name,
      nzOnOk: () =>{
        var body = Policy.clone(policy);
        body.state = globalvar.DOCSTAT_ACTIVE;
        this.http.post("/api/policy/state", body).subscribe((res: any)=>{
          this.onSearch();
        });
      }
   });
  } 

  getAll(): void{
    this.http.get("/api/console/policy/list").subscribe((res: any)=>{
      this.policies = res;
    });
  }

 
}

