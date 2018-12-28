import { Component, OnInit, ElementRef } from '@angular/core';
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
              private modal: NzModalService,
              private er: ElementRef) {
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
        name: this.searchFormGroup.get("name").value,
        partner: this.searchFormGroup.get("partner").value,
      }
    }).subscribe((res: any)=>{
      if(res==null){
        this.pdocs = [];
      }
      else{
        console.log("get pdoc list");
        console.log(res);
        this.pdocs = res;
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
    var upUrl = "/api/pdoc/upload?partner=" + this.uploadFormGroup.get("partner").value;
    this.uploader.setOptions({
      url: upUrl,
      removeAfterUpload: true, 
      maxFileSize: 102400000,
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
    else{
      console.log("....upload param error.....")
    }
  }

  onDelete(pdoc: PartnerDoc){
    this.confirmModal = this.modal.confirm({
      nzTitle: '您确定要删除该文件吗？',
      nzContent: pdoc.name,
      nzOnOk: () => this.deletePdoc(pdoc)
    });

  }

  deletePdoc(pdoc: PartnerDoc){
    this.http.get("/api/console/pdoc/delete", {
      params:{
        name: pdoc.name,
        partner: pdoc.partner
      }}).subscribe((res: any)=>{
        this.onSearch();
      });
    }
  

}


