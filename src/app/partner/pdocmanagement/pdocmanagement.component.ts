import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import * as moment from 'moment';
import * as globalvar from './../../globalvar';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { PartnerDoc } from './../pdoc/pdoc.component';
import { RespData, RespPage, PageRequest } from './../../common/dto';
import { GlobalService } from 'src/app/global.service';

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
              private er: ElementRef,
              private gs: GlobalService) {
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
    var page = new PageRequest();  
    page.append("name", this.searchFormGroup.get("name").value);
    page.append("partner", this.searchFormGroup.get("partner").value);

    this.http.post("/api/front/pdoc/list", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.pdocs = res.data;
      }
      else{
        this.pdocs = [];
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
      authToken: this.gs.getToken(),
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
    var body = {
      name: pdoc.name,
      partner: pdoc.partner
    }
    this.http.post("/api/console/pdoc/delete", body).subscribe((res: any)=>{
        this.onSearch();
      });
    }
  

}


