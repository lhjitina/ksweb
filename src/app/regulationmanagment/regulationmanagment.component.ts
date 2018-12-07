import { Component, OnInit, ElementRef } from '@angular/core';
import { Regulation } from './../regulation/regulation.component';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';

const upUrl = "/api/regulation/upload";

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
  uploader:FileUploader = new FileUploader({url: upUrl});

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
    this.http.get("/api/department/list").subscribe((res: any)=>{
      this.departments = res;
    });

    this.http.get("/api/regmgt/list").subscribe((res: any)=>{
      this.regMgts = res;
    });
  }

  onSearch(): void{
    console.log("......submit search........");
  }

  onUpload(): void{
    console.log(".......upload........");
    let e = this.er.nativeElement.querySelector(".reg-upload");
    console.log(e);
    e.click();
  }
}

export class RegulationMgt extends Regulation{
  public state: string;
  public operateUser: string;
  public operateTime: string;
}