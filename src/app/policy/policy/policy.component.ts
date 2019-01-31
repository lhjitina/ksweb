import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup,  Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { RespData, RespPage, PageRequest } from './../../common/dto';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})

export class PolicyComponent implements OnInit {
  public policies: Array<Policy>;
  public searchFormGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private http: HttpClient) {

              }

  ngOnInit() {
    this.searchFormGroup = this.fb.group({
      name: [''],
      institution: [''],
      startDate: [''],
      endDate: ['']
    });
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
    page.append("institution", this.searchFormGroup.get("institution").value);
    this.http.post("/api/front/policy/list", page).subscribe((res: RespPage)=>{
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
      this.getAll();
    }
  }

  setUploadParams(): void{
    var upUrl = "/api/policy/upload?institution=" + this.poliUploadFormGroup.get("institution").value;
    var issueDate = moment(this.poliUploadFormGroup.get("issueDate").value).format("YYYY-MM-DD");
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

