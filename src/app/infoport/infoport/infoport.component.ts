import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import * as moment from 'moment';
import * as Global from './../../globalvar';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { RespData, RespPage, PageRequest } from './../../common/dto';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-infoport',
  templateUrl: './infoport.component.html',
  styleUrls: ['./infoport.component.css']
})
export class InfoportComponent implements OnInit {

  infos: ShareInfo[] = [];
  searchFormGroup: FormGroup;
  uploadFormGroup: FormGroup;
  uploader:FileUploader;
  bShowUplodModal: boolean = false;
  bHasClicked: boolean = false;
  uploadTYPE: string = "upload"; //or "refresh"
  refreshedinfo = new ShareInfo();
  confirmModal: NzModalRef; 

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private modal: NzModalService,
              private msg: NzMessageService,
              private er: ElementRef,
              private gs: GlobalService) {
    this.searchFormGroup = this.fb.group({
      name: [''],
      tag: ['']
    });

    this.uploadFormGroup = this.fb.group({
      tag: ['']
    });

  }

  ngOnInit() {    
    this.onSearch();
    this.initUploader();
   }

  onSearch(): void{
    var page = new PageRequest();  
    page.append("name", this.searchFormGroup.get("name").value);
    page.append("tag", this.searchFormGroup.get("tag").value);

    this.http.post("/api/share/list", page).subscribe((res: RespPage)=>{
      console.log(res);
      if (res.code == 0){
        this.infos = res.data;
      }
      else{
        this.infos = [];
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
    var upUrl: string;
    if (this.uploadTYPE == 'upload'){
      upUrl = "/api/share/upload?tag=" + this.uploadFormGroup.get("tag").value;
    }
    else{
      upUrl = "/api/share/refresh?tag=" + this.uploadFormGroup.get("tag").value;
    }
    console.log(upUrl);
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
    this.uploadTYPE = "upload";
    this.uploadFormGroup.patchValue({"tag":''});
  }

  selectFileChange(event: any): void{
    if (this.uploader.queue.length>0 && this.uploadTYPE === 'upload'){
      this.bShowUplodModal = true;
    }
    else if (this.uploader.queue.length > 0 && this.uploadTYPE == 'refresh'){
      if (this.uploader.queue[0].file.name == this.refreshedinfo.name){
        this.bShowUplodModal = true;
      }
      else{
        this.msg.error("选择文件和原文件名称不一致！请重新选择。");

      }
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

  onDelete(info: ShareInfo){
    this.confirmModal = this.modal.confirm({
      nzTitle: '您确定要删除该文件吗？',
      nzContent: info.name,
      nzOnOk: () => this.deleteInfo(info)
    });
  }

  deleteInfo(info: ShareInfo){
    var body = {
      name: info.name
    }
    this.http.post("/api/share/delete", body).subscribe((res: any)=>{
        this.onSearch();
      });
    }

  onRefresh(info: ShareInfo){
    this.refreshedinfo = info;
    this.uploader.clearQueue();
    let e = this.er.nativeElement.querySelector(".reg-upload");
    e.click();
    this.bHasClicked = false;      
    this.uploadTYPE = "refresh"
    this.uploadFormGroup.patchValue({"tag": info.tag});
  }

  onDownload(info: ShareInfo): void{
    var url = "/api/share/content?name=" + info.name;
    this.http.get(url, { responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = info.name;
      a.click();
      URL.revokeObjectURL(a.href);  
    });
  }
}



export class ShareInfo{
  name: string;
  tag: string;
  operatorName: string;
  operatorId: number;
  operateTime: Date;

  constructor(){
    this.name = '';
    this.tag = '';
    this.operateTime = null;
    this.operatorId = 0;
    this.operatorName = '';
  }
}
