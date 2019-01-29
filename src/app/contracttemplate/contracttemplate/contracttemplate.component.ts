import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder,  FormGroup, FormControl, AbstractControl, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as Global from './../../globalvar';
import { RespData, RespPage, PageRequest } from './../../common/dto';
import { FileUploader } from 'ng2-file-upload';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-contracttemplate',
  templateUrl: './contracttemplate.component.html',
  styleUrls: ['./contracttemplate.component.css']
})
export class ContracttemplateComponent implements OnInit {
  contracts: ContractTemplate[] = [];
  states: string[] = Global.DOCSTATS;
  searchFormGroup: FormGroup;
  uploadFormGroup: FormGroup;
  fuzzySearchFormGroup: FormGroup;
  uploader:FileUploader;
  bShowUplodModal: boolean = false;
  bHasClicked: boolean = false;

  confirmModal: NzModalRef; 

  constructor(private er: ElementRef,
              private fb: FormBuilder,
              private http: HttpClient,
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

    this.http.post("/api/front/contracttemplate/list", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.contracts = res.data;
      }
      else{
        this.contracts = [];
        console.log(res.message);
      }
    }) 
  }

  onDownload(data: any): void{
    let ct = data as ContractTemplate;
    var url = "/api/contracttemplate/content/" + ct.name;
    this.http.get(url, {responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = ct.name;
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
    var upUrl = "/api/contracttemplate/upload?issueDate=";
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

  onAbate(contract: ContractTemplate): void{
    this.confirmModal = this.modal.confirm({
      nzTitle: '您确定要作废该模版吗？',
      nzContent: contract.name,
      nzOnOk: () =>{
        var body = ContractTemplate.clone(contract);
        body.state = Global.DOCSTAT_ABATED;
        this.http.post("/api/contracttemplate/state", body).subscribe((res: any)=>{
          this.onSearch();
        });
      }
   });
  }

  onActive(contract: ContractTemplate): void{
    this.confirmModal = this.modal.confirm({
      nzTitle: '您确定要生效该模版吗？',
      nzContent: contract.name,
      nzOnOk: () =>{
        var body = ContractTemplate.clone(contract);
        body.state = Global.DOCSTAT_ACTIVE;
        this.http.post("/api/contracttemplate/state", body).subscribe((res: any)=>{
          this.onSearch();
        });
      }
   });
  } 

  perCon(): boolean{
    return this.gs.getUser().perCon;
  }

  cardTitle(i: any, data: any): string{
    let info = data as ContractTemplate;
    i += 1;
    return "[" + i + "] " + info.name; 
  }
}


export class ContractTemplate {
  public name: string;
  public state: string;
  public issueDate: Date;
  public operatorName: string;
  public operatorId: number;
  public operateTime: Date;
  
  constructor(){}
  public static clone(c: ContractTemplate){
    var r = new ContractTemplate();
    r.name = c.name;
    r.issueDate = c.issueDate;
    r.state = c.state;
    r.operateTime = c.operateTime;
    r.operatorId = c.operatorId;
    r.operatorName = c.operatorName;  
    return r;
  }}

