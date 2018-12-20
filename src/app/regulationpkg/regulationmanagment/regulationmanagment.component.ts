import { Component, OnInit, ElementRef } from '@angular/core';
import { Regulation } from './../regulation/regulation.component';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { createHostListener } from '@angular/compiler/src/core';
import { Department } from 'src/app/app.component';
import * as moment from 'moment';
import * as globalvar from './../../globalvar';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { StringMap } from '@angular/core/src/render3/jit/compiler_facade_interface';
import { URLSearchParams } from '@angular/http';

@Component({
  selector: 'app-regulationmanagment',
  templateUrl: './regulationmanagment.component.html',
  styleUrls: ['./regulationmanagment.component.css']
})
export class RegulationmanagmentComponent implements OnInit {

  userManageDepartments: Department[] = [];
  regulations: Regulation[] = [];
  states: string[] = ["有效","作废"];
  regulationSearchFormGroup: FormGroup;
  uploadFormGroup: FormGroup;
  abateFormGroup: FormGroup;

  uploader:FileUploader;
  bShowUplodModal: boolean = false;
  bHasClicked: boolean = false;

  confirmModal: NzModalRef; 

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private er: ElementRef,
              private modal: NzModalService) {
    this.regulationSearchFormGroup = this.fb.group({
      department: [''],
      fileName: [''],
      startDate: [''],
      endDate: [''],
      state: ['']
    });

    this.uploadFormGroup = this.fb.group({
      department: ['', Validators.required],
      issueDate: ['', Validators.required]
    });

    this.abateFormGroup = this.fb.group({
      name: ['hello'],
      state: ['作废']
    });
  }

  ngOnInit() {    
    this.initUploader();
    this.http.get("/api/permission/department").subscribe((res: any)=>{
      this.userManageDepartments = res;
      console.log("...........")
      console.log(this.userManageDepartments)
      console.log("...........")
    });

    this.http.get("/api/regulation/list").subscribe((res: any)=>{
      this.regulations = res;
    });


   }

  onSearch(): void{
    console.log("......submit search........");
  }

  initUploader(): void{
    console.log("....upload department is:" + this.uploadFormGroup.get("department").value);
    this.uploader = new FileUploader({});
    this.uploader.onCompleteAll=()=>{
      this.bShowUplodModal = false;
      this.uploader.clearQueue();
      this.er.nativeElement.querySelector(".reg-upload").value='';
      this.http.get("/api/regulation/list").subscribe((res: any)=>{
          this.regulations = res;
      });     
    }
  }
  setUploadParams(): void{
    var upUrl = "/api/regulation/upload?department=" + this.uploadFormGroup.get("department").value;
    var issueDate = moment(this.uploadFormGroup.get("issueDate").value).format("YYYY-MM-DD");
    upUrl = upUrl + "&issueDate=" + issueDate;

    console.log("upload url:"+upUrl);
    this.uploader.setOptions({
      url: upUrl,

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

  onAbate(name: string): void{
    this.confirmModal = this.modal.confirm({
      nzTitle: '您确定要作废该文件吗？',
      nzContent: name,
      nzOnOk: () =>{
        console.log("you are abating:"+name);
       
        body.append("name", "hello");
        body.append("state", "作废");
        this.http.post("/api/regulation/state", body).subscribe((res: any)=>{
          this.http.get("/api/regulation/list").subscribe((res: any)=>{
            this.regulations = res;
          });
        });
      }
   });
  } 
}

