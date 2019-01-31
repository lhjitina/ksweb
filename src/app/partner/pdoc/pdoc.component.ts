import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder,  FormGroup,  Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { RespData, RespPage, PageRequest } from './../../common/dto';
import { GlobalService } from 'src/app/global.service';
import { NzModalService } from 'ng-zorro-antd';
import { FileUploader } from 'ng2-file-upload';
import * as globalvar from './../../globalvar';

@Component({
  selector: 'app-pdoc',
  templateUrl: './pdoc.component.html',
  styleUrls: ['./pdoc.component.css']
})
export class PdocComponent implements OnInit {
  pdocs: PartnerDoc[] = [];
  states: string[] = globalvar.DOCSTATS;
  searchFormGroup: FormGroup;
  uploadFormGroup: FormGroup;
  uploader:FileUploader;
  bShowUplodModal: boolean = false;
  bHasClicked: boolean = false;
  fuzzySearchFormGroup:FormGroup;

  constructor(private gs: GlobalService,
              private fb: FormBuilder,
              private http: HttpClient,
              private modal: NzModalService,
              private er: ElementRef) {
    this.searchFormGroup = this.fb.group({
      name: [''],
      partner: [''],
    });

    this.uploadFormGroup = this.fb.group({
      partner: ['', Validators.required]
    });

    this.fuzzySearchFormGroup = this.fb.group({
      keys: ['']
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

  onDownload(pdoc: PartnerDoc): void{
    var url = "/api/pdoc/content?name=" + pdoc.name + "&partner=" + pdoc.partner;
    this.http.get(url, {responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = pdoc.name;
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  perDoc(): boolean{
    return this.gs.getUser().perDoc;
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
    this.modal.confirm({
      nzTitle: '您确定要删除该文件吗？',
      nzContent: pdoc.name,
      nzOnOk: () => this.deletePdoc(pdoc)
    });

  }

  deletePdoc(pdoc: PartnerDoc){
    var body = {
      name: pdoc.name,
    }
    this.http.post("/api/console/pdoc/delete", body).subscribe((res: RespData)=>{
      if (res.code == 0){
        this.onSearch();
      }
      else{
        console.log(res.message);
      }
    });
  }
  
  cardTitle(i: any, data: any): string{
    let info = data as PartnerDoc;
    i += 1;
    return "[" + i + "] " + info.name; 
  }
}


export class PartnerDoc {
  public name: string;
  public partner: string;
  public operatorName: string;
  public operatorId: number;
  public operateTime: Date;
  
  constructor(){}

  public static clone(c: PartnerDoc){
    var r = new PartnerDoc();
    r.name = c.name;
    r.partner = c.partner;
    r.operateTime = c.operateTime;
    r.operatorId = c.operatorId;
    r.operatorName = c.operatorName;  
    return r;
  }
}

