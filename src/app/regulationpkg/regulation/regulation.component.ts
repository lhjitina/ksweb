import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,  FormGroup, FormControl, AbstractControl, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Department } from 'src/app/app.component';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-regulation',
  templateUrl: './regulation.component.html',
  styleUrls: ['./regulation.component.css']
})
export class RegulationComponent implements OnInit {

  public Regulations: Array<Regulation>;
  public Departments: Department[];
  public pageSize: number = 2;
  public regSearchFormGroup: FormGroup;

  constructor(private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private http: HttpClient) {

              }

  ngOnInit() {
    this.regSearchFormGroup = this.fb.group({
      fileName: [''],
      department: [''],
      startDate: [''],
      endDate: ['']
    });

    this.http.get("/api/front/regulation/list").subscribe((res: any)=>{
      this.Regulations = res;
    })

    this.http.get("/api/department/list").subscribe((res: any)=>{
      this.Departments = res;
    })
  }

  onSearch(): void{
    var sd = this.regSearchFormGroup.get("startDate").value;
    var ed = this.regSearchFormGroup.get("endDate").value;
    moment.isDate(sd) ? sd = moment(sd).format("YYYY-MM-DD") : sd = "";
    moment.isDate(ed) ? ed = moment(ed).format("YYYY-MM-DD") : ed = "";
    console.log("search with department:");
    console.log(this.regSearchFormGroup.get("department").value);
    this.http.get("/api/front/regulation/list", {
      params: {
        name: this.regSearchFormGroup.get("fileName").value,
        department: this.regSearchFormGroup.get("department").value,
        startDate: sd,
        endDate: ed
      }
    }).subscribe((res: any)=>{
      this.Regulations = res;
    })
  
  }

  onDepartmentSelectChange(): void {
    if(this.regSearchFormGroup.get("department").value == null){
      this.regSearchFormGroup.patchValue({department: ''});
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

