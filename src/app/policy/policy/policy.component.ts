import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder,  FormGroup,  Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { RespData, RespPage, PageRequest } from './../../common/dto';
import * as globalvar from './../../globalvar';
import { FileUploader } from 'ng2-file-upload';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { GlobalService } from 'src/app/global.service';
@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})

export class PolicyComponent implements OnInit {
  policies: Policy[] = [];
  states: string[] = globalvar.DOCSTATS;
  searchFormGroup: FormGroup;
  uploadFormGroup: FormGroup;
  test: string = "test";
  poliUploader:FileUploader;
  bShowUplodModal: boolean = false;
  bHasClicked: boolean = false;
  fuzzySearchFormGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private er: ElementRef,
              private modal: NzModalService,
              private msg: NzMessageService,
              private gs: GlobalService) {
    this.searchFormGroup = this.fb.group({
      name: [''],
      institution: [''],
      startDate: [''],
      endDate: [''],
      state: [globalvar.DOCSTAT_ACTIVE]
    });                
    this.uploadFormGroup = this.fb.group({
      institution: ['', Validators.required],
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
    page.append("institution", this.searchFormGroup.get("institution").value);
    page.append("state", this.searchFormGroup.get("state").value);
    this.http.post("/api/policy/list", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.policies = res.data;        
      }
      else{
        console.log(res.message);
        this.policies = [];
      }
    })  
  }

  initUploader(): void{
    this.poliUploader = new FileUploader({});
    this.poliUploader.onCompleteAll=()=>{
      this.bShowUplodModal = false;
      this.poliUploader.clearQueue();
      this.er.nativeElement.querySelector(".reg-upload").value='';
      this.onSearch();
    }
    this.poliUploader.onSuccessItem=(item: any, response: string, status: number, headers: any): any=>{
      let res: RespData = JSON.parse(response);
      if (status != 200){
        this.msg.create('error', "发生错误：" + status);
      }
      else if (res.code != 0){
        this.msg.create('error', res.message);
      }
    }; }

  setUploadParams(): void{
    var upUrl = "/api/policy/upload?institution=" + this.uploadFormGroup.get("institution").value;
    var issueDate = moment(this.uploadFormGroup.get("issueDate").value).format("YYYY-MM-DD");
    upUrl = upUrl + "&issueDate=" + issueDate;

    this.poliUploader.setOptions({
      url: upUrl,
      authToken: this.gs.getToken(),
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
    if (this.uploadFormGroup.valid){
      this.setUploadParams();
      this.poliUploader.uploadAll();
      this.bHasClicked = true;
    }
    else{
      console.log("....upload param error.....")
    }
  }

  onAbate(policy: Policy): void{
    this.modal.confirm({
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
    this.modal.confirm({
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

  onDownload(name: string): void{
    var url = "/api/policy/content/" + name;
    this.http.get(url, { responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = name;
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  perPol(): boolean{
    return this.gs.getUser().perPol;
  }

  cardTitle(i: any, data: any): string{
    let info = data as Policy;
    i += 1;
    return "[" + i + "] " + info.name; 
  }

  onFuzzySearch(): void{
    var page = new PageRequest();  
    page.append("keys", this.fuzzySearchFormGroup.get("keys").value);
    this.http.post("/api/policy/fuzzy", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.policies = res.data;
      }
      else{
        this.policies = [];
      }
    })     
  }
}


export class Policy {
  public name: string;
  public institution: string;
  public issueDate: Date;
  public state: string;
  public operatorName: string;
  public operatorId: number;
  public operateTime: Date;
  
  constructor(){}

  public static clone(c: Policy){
    var r = new Policy();
    r.name = c.name;
    r.institution = c.institution;
    r.issueDate = c.issueDate;
    r.state = c.state;
    r.operateTime = c.operateTime;
    r.operatorId = c.operatorId;
    r.operatorName = c.operatorName;  
    return r;
  }
}

