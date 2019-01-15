import { Component, OnInit, ElementRef } from '@angular/core';
import { Regulation } from './../regulation/regulation.component';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { Department } from 'src/app/app.component';
import * as moment from 'moment';
import * as globalvar from './../../globalvar';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { RespPage, RespData, PageRequest } from './../../common/dto';
import { GlobalService } from 'src/app/global.service';
@Component({
  selector: 'app-regulationmanagment',
  templateUrl: './regulationmanagment.component.html',
  styleUrls: ['./regulationmanagment.component.css']
})
export class RegulationmanagmentComponent implements OnInit {

  departments: Department[] = [];
  regulations: Regulation[] = [];
  states: string[] = globalvar.DOCSTATS;
  regSearchFormGroup: FormGroup;
  uploadFormGroup: FormGroup;
  abateFormGroup: FormGroup;

  uploader:FileUploader;
  bShowUplodModal: boolean = false;
  bHasClicked: boolean = false;

  confirmModal: NzModalRef; 

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private er: ElementRef,
              private modal: NzModalService,
              private gs: GlobalService) {
    this.regSearchFormGroup = this.fb.group({
      departmentId: [''],
      name: [''],
      startDate: [''],
      endDate: [''],
      state: [globalvar.DOCSTAT_ACTIVE]
    });

    this.uploadFormGroup = this.fb.group({
      department: ['', Validators.required],
      issueDate: ['', Validators.required]
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
    var sd = this.regSearchFormGroup.get("startDate").value;
    var ed = this.regSearchFormGroup.get("endDate").value;
    if (moment.isDate(sd)) { 
      page.append("startDate", moment(sd).format("YYYY-MM-DD")) 
    };
    if (moment.isDate(ed)) { 
      page.append("endDate", moment(ed).format("YYYY-MM-DD")) 
    };
    page.append("name", this.regSearchFormGroup.get("name").value);
    page.append("departmentId", this.regSearchFormGroup.get("departmentId").value);
    page.append("state", this.regSearchFormGroup.get("state").value);

    this.http.post("/api/front/regulation/list", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.regulations = res.data;        
      }
      else{
        console.log(res.message);
        this.regulations = [];
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
    this.confirmModal = this.modal.confirm({
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
    this.confirmModal = this.modal.confirm({
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

  onDepartmentSelectChange(): void {
    if(this.regSearchFormGroup.get("department").value == null){
      this.regSearchFormGroup.patchValue({department: ''});
    } 
  }

}

