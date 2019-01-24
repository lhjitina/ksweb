import { Component, OnInit, ElementRef} from '@angular/core';
import { FormBuilder,  FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as Global from './../../globalvar';
import * as moment from 'moment';
import { FileUploader } from 'ng2-file-upload';
import { RespData, RespPage, PageRequest } from './../../common/dto';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})

export class ContractComponent implements OnInit {
  public contracts: Contract[] = [];
  public searchFormGroup: FormGroup;
  public uploadFormGroup: FormGroup;
  public perCw: boolean = false;

  uploader:FileUploader;
  bShowUplodModal: boolean = false;
  bHasClicked: boolean = false;

  confirmModal: NzModalRef; 
  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private gs: GlobalService,
              private er: ElementRef,
              private ms: NzModalService) {
    this.searchFormGroup = this.fb.group({
      name: [''],
      partner: [''],
      type: [''],
      startDate: [''],
      endDate: ['']

    });

    this.uploadFormGroup = this.fb.group({
      partner: [''],
      type: [''],
      digest: [''],
      start: ['', Validators.required],
      end: ['', Validators.required],
      autoRenewal: ['0']
    });
              }

  ngOnInit() {
    this.perCw = this.gs.getUser().perCw;
    this.initUploader();
    this.onSearch();

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
    page.append("partner", this.searchFormGroup.get("partner").value);
    page.append("type", this.searchFormGroup.get("type").value);   

    this.http.post("/api/contract/list", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.contracts = res.data;        
      }
      else{
        console.log(res.message);
        this.contracts = [];
      }
    })
   }

  onDownload(c: Contract): void{
    var url = "/api/contract/content/" + c.name;
    this.http.get(url, { observe: 'body', responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = c.name;
      a.click();
      URL.revokeObjectURL(a.href);
    });
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
    var upUrl = "/api/contract/upload?";
    upUrl += "partner=" + this.uploadFormGroup.get("partner").value;
    upUrl += "&type=" + this.uploadFormGroup.get("type").value;
    upUrl += "&digest=" + this.uploadFormGroup.get("digest").value;
    upUrl += "&autoRenewal=" + this.uploadFormGroup.get("autoRenewal").value;

    var startDate = moment(this.uploadFormGroup.get("start").value).format("YYYY-MM-DD");
    upUrl += "&start=" + startDate;
    var endDate = moment(this.uploadFormGroup.get("end").value).format("YYYY-MM-DD");
    upUrl += "&end=" + endDate;

    console.log("upload contract url:" + upUrl);
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

  onDelete(c: Contract): void{
    this.ms.confirm({
      nzTitle: '您确定要删除该文件吗？',
      nzContent: c.name,
      nzOnOk: () => this.deleteContract(c)
    })
  }

  deleteContract(c: Contract): void{
    let body = {
      name: c.name
    };
    this.http.post("/api/contract/delete", body).subscribe((res: RespData)=>{
      console.log(res);
      this.onSearch();
    });
  }
}


export class Contract {
  public name: string;
  public partner: string;
  public type: string;
  public start: Date;
  public end: Date;
  public digest: string;
  public autoRenewal: number;
  public operatorName: string;
  public operatorId: number;
  public operateTime: Date;
  
  constructor(){

  }

  public static clone(c: Contract): Contract{
    var r = new Contract();
    r.name = c.name;
    r.partner = c.partner;
    r.type = c.type;
    r.start = c.start;
    r.end = c.end;
    r.digest = c.digest;
    r.autoRenewal = c.autoRenewal;
    r.operateTime = c.operateTime;
    r.operatorId = c.operatorId;
    r.operatorName = c.operatorName;  
    return r;
  }
}

