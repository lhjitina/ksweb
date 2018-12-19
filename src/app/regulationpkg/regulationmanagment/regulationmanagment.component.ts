import { Component, OnInit, ElementRef } from '@angular/core';
import { Regulation } from './../regulation/regulation.component';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { post } from 'selenium-webdriver/http';
import { createHostListener } from '@angular/compiler/src/core';
import { Department } from 'src/app/app.component';
import * as moment from 'moment';


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

  uploader:FileUploader;
  bShowUplodModal: boolean = false;
  bHasClicked: boolean = false;

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private er: ElementRef) {
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
}

