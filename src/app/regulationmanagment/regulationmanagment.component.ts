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

  userDepartment: string = "方案策划部";
  regMgts: RegulationMgt[] = [];
  departments: string[] = [];
  states: string[] = ["有效","作废"];
  regulationMgtFormGroup: FormGroup;
  uploader:FileUploader;
  isVisible: boolean = false;
  retInfo: string = "";
  uploadProg: number = 0;
  fileName: string = '';

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
    var upUrl = "/api/regulation/upload?department=方案策划部&operateUser=lhj";
    this.uploader = new FileUploader({url: upUrl, 
      removeAfterUpload: true, 
      maxFileSize: 10240000,
      method: "POST"});

    this.http.get("/api/department/list").subscribe((res: any)=>{
      this.departments = res;
    });

    this.http.get("/api/regmgt/list").subscribe((res: any)=>{
      this.regMgts = res;
    });

    this.uploader.onCompleteAll=()=>{
      this.retInfo = "upload ok!";
      this.http.get("/api/regmgt/list").subscribe((res: any)=>{
        this.regMgts = res;
      });     
    }
    this.uploader.onProgressAll=(progress:any)=>{this.uploadProg = progress;}
  }

  onSearch(): void{
    console.log("......submit search........");
  }

  onUpload(): void{
//   console.log(".......upload........");
    this.uploader.clearQueue();
   let e = this.er.nativeElement.querySelector(".reg-upload");
    e.click();
  }

  selectFileChange(event: any): void{
    if (this.uploader.queue.length>0){
      this.fileName = this.uploader.queue[0].file.name;
      this.isVisible = true;
            console.log("....up loading..")
      this.uploader.uploadAll();

    }

  }

  handleCancel():void{
    this.isVisible = false;
  }
  handleOk(): void{
    this.isVisible = false;
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