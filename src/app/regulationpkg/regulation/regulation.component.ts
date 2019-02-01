import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormBuilder,  FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Department } from 'src/app/app.component';
import { RespData, RespPage, PageRequest } from './../../common/dto';
import * as globalvar from './../../globalvar';
import { FileUploader } from 'ng2-file-upload';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-regulation',
  templateUrl: './regulation.component.html',
  styleUrls: ['./regulation.component.css']
})
export class RegulationComponent implements OnInit {
  departments: Department[] = [];
  regulations: Regulation[] = [];
  states: string[] = globalvar.DOCSTATS;
  searchFormGroup: FormGroup;
  uploadFormGroup: FormGroup;
  abateFormGroup: FormGroup;
  fuzzySearchFormGroup: FormGroup;
  uploader:FileUploader;
  bShowUplodModal: boolean = false;
  bHasClicked: boolean = false;

  constructor(private er: ElementRef,
              private fb: FormBuilder,
              private http: HttpClient,
              private modal: NzModalService,
              private msg: NzMessageService,
              private gs: GlobalService) {
    this.searchFormGroup = this.fb.group({
      name: [''],
      departmentId: [''],
      startDate: [''],
      endDate: [''],
      state: [globalvar.DOCSTAT_ACTIVE]   
    });
    this.uploadFormGroup = this.fb.group({
      department: ['', Validators.required],
      issueDate: ['', Validators.required]
    });              
    this.fuzzySearchFormGroup = this.fb.group({
      keys: ['']
    });
  }

  ngOnInit() {
    this.initUploader();
    this.onSearch();
    this.getDepartments();
  }

  getDepartments(): void{
    this.http.post("/api/department/list", new PageRequest).subscribe((res: RespPage)=>{
      if (res.code == 0){
       this.departments = res.data;       
      }
      else{
        console.log(res.message);        
      }
    });
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
    page.append("departmentId", this.searchFormGroup.get("departmentId").value);
    page.append("state", this.searchFormGroup.get("state").value);

    this.http.post("/api/regulation/list", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.regulations = res.data;        
      }
      else{
        console.log(res.message);
        this.regulations = [];
      }
    })
   }

  onDepartmentSelectChange(): void {
    if(this.searchFormGroup.get("departmentId").value == null){
      this.searchFormGroup.patchValue({departmentId: ''});
    } 
  }

  onDownload(name: string): void{
    var url = "/api/regulation/content/" + name;
    this.http.get(url, { observe: 'body', responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = name;
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
    this.uploader.onSuccessItem=(item: any, response: string, status: number, headers: any): any=>{
      let res: RespData = JSON.parse(response);
      if (status != 200){
        this.msg.create('error', "发生错误：" + status);
      }
      else if (res.code != 0){
        this.msg.create('error', res.message);
      }
    };  
  }

  setUploadParams(): void{
    var upUrl = "/api/regulation/upload?department=" + this.uploadFormGroup.get("department").value;
    var issueDate = moment(this.uploadFormGroup.get("issueDate").value).format("YYYY-MM-DD");
    upUrl = upUrl + "&issueDate=" + issueDate;

    console.log("upload url:"+upUrl);
    this.uploader.setOptions({
      url: upUrl,
      authToken: this.gs.getToken(),
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

  onAbate(reg: Regulation): void{
    this.modal.confirm({
      nzTitle: '您确定要作废该文件吗？',
      nzContent: reg.name,
      nzOnOk: () =>{
        var body = Regulation.clone(reg);
        body.state = globalvar.DOCSTAT_ABATED;
        this.http.post("/api/regulation/state", body).subscribe((res: any)=>{
          this.onSearch();
        });
      }
    });
  }

  onActive(reg: Regulation): void{
    this.modal.confirm({
      nzTitle: '您确定要生效该文件吗？',
      nzContent: reg.name,
      nzOnOk: () =>{
        var body = Regulation.clone(reg);
        body.state = globalvar.DOCSTAT_ACTIVE;
        this.http.post("/api/regulation/state", body).subscribe((res: any)=>{
          this.onSearch();
        });
      }
   });
  } 

  cardTitle(i: any, data: any): string{
    let info = data as Regulation;
    i += 1;
    return "[" + i + "] " + info.name; 
  }

  perReg(): boolean{
    return this.gs.getUser().perReg;
  }
}


export class Regulation {
  public name: string;
  public departmentName: string;
  public departmentId: number;
  public issueDate: Date;
  public state: string;
  public operatorName: string;
  public operatorId: number;
  public operateTime: Date;
  
  constructor(){

  }

  public static clone(c){
    var r = new Regulation();
    r.name = c.name;
    r.departmentName = c.departmentName;
    r.departmentId = c.departmentId;
    r.issueDate = c.issueDate;
    r.state = c.state;
    r.operateTime = c.operateTime;
    r.operatorId = c.operatorId;
    r.operatorName = c.operatorName;  
    return r;
  }
}

