import { Component, OnInit, ElementRef } from '@angular/core';
import { Regulation } from './../regulation/regulation.component';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { post } from 'selenium-webdriver/http';
import { createHostListener } from '@angular/compiler/src/core';



@Component({
  selector: 'app-regulationmanagment',
  templateUrl: './regulationmanagment.component.html',
  styleUrls: ['./regulationmanagment.component.css']
})
export class RegulationmanagmentComponent implements OnInit {

  userManageDepartments: string[] = ["方案策划部", "市场营销部"];
  regMgts: RegulationMgt[] = [];
  states: string[] = ["有效","作废"];
  regulationMgtFormGroup: FormGroup;
  uploader:FileUploader;
  isUpload: boolean = false;
  fileDepartment: string = "方案策划部";
  bHasClicked: boolean = false;

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private er: ElementRef) {
    this.regulationMgtFormGroup = this.fb.group({
      department: [''],
      fileName: [''],
      startDate: [''],
      endDate: [''],
      state: ['']
    });
  }

  ngOnInit() {    
    this.initUploader();
    this.http.get("/api/department/list").subscribe((res: any)=>{
      this.userManageDepartments = res;
    });

    this.http.get("/api/regmgt/list").subscribe((res: any)=>{
      this.regMgts = res;
    });


   }

  onSearch(): void{
    console.log("......submit search........");
  }

  initUploader(): void{
    var upUrl = "/api/regulation/upload?department=方案策划部&operateUser=lhj";
    this.uploader = new FileUploader({url: upUrl, 
      removeAfterUpload: true, 
      maxFileSize: 10240000,
      method: "POST"});

    this.uploader.onCompleteAll=()=>{
      this.isUpload = false;
      this.http.get("/api/regmgt/list").subscribe((res: any)=>{
          this.regMgts = res;
      });     
    }
  }

  onUpload(): void{
    this.initUploader();
    this.uploader.clearQueue();
    let e = this.er.nativeElement.querySelector(".reg-upload");
    e.click();
    this.bHasClicked = false;
  }

  selectFileChange(event: any): void{
    if (this.uploader.queue.length>0){
      this.isUpload = true;
    }

  }

  nzOnCancel():void{
    this.isUpload = false;
    this.uploader.cancelAll();
    this.uploader.clearQueue(); 
  }

  nzOnOk(): void{
    this.uploader.uploadAll();
    this.bHasClicked = true;
  }
}

export class RegulationMgt{
  public Id: number;
  public Name: string;
  public Department: string;
  public PubDate: Date;
  public state: string;
  public operateUser: string;
  public operateTime: string;
}