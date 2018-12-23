import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { Department } from 'src/app/app.component';
import * as moment from 'moment';
import * as globalvar from './../../globalvar';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Summary } from '../summary/summary.component';

@Component({
  selector: 'app-summarymanagement',
  templateUrl: './summarymanagement.component.html',
  styleUrls: ['./summarymanagement.component.css']
})
export class SummarymanagementComponent implements OnInit {

  summaries: Summary[] = [];
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
    });

    this.uploadFormGroup = this.fb.group({
      meetingDate: ['', Validators.required]
    });

  }

  ngOnInit() {    
    this.initUploader();
    this.onSearch();
   }

  onSearch(): void{
    var sd = this.searchFormGroup.get("startDate").value;
    var ed = this.searchFormGroup.get("endDate").value;
    moment.isDate(sd) ? sd = moment(sd).format("YYYY-MM-DD") : sd = "";
    moment.isDate(ed) ? ed = moment(ed).format("YYYY-MM-DD") : ed = "";

    this.http.get("/api/console/summary/list", {
      params: {
        name: this.searchFormGroup.get("name").value,
        startDate: sd,
        endDate: ed,
      }
    }).subscribe((res: any)=>{
      if(res==null){
        this.summaries = [];
      }
      else{
        this.summaries = res;
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
    var upUrl = "/api/summary/upload?meetingDate=";
    var meetingDate = moment(this.uploadFormGroup.get("meetingDate").value).format("YYYY-MM-DD");
    upUrl += meetingDate;

    this.uploader.setOptions({
      url: upUrl,
      removeAfterUpload: true, 
      maxFileSize: 10240000,
      method: "POST"    
    })
  }

  onUpload(): void{
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
    console.log("start upload....")
    if (this.uploadFormGroup.valid){
      this.setUploadParams();
      this.uploader.uploadAll();
      this.bHasClicked = true;
    }
    else{
      console.log("....upload param error.....")
    }
  }

}

