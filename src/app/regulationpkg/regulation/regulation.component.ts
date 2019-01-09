import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,  FormGroup, FormControl, AbstractControl, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Department } from 'src/app/app.component';
import { RespData, RespPage, PageRequest } from './../../common/dto';

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
      name: [''],
      departmentId: [''],
      startDate: [''],
      endDate: ['']
    });
    this.onSearch();

    this.http.post("/api/department/list", new PageRequest).subscribe((res: RespPage)=>{
      if (res.code == 0){
       this.Departments = res.data;       
      }
      else{
        console.log(res.message);        
      }
    })
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
    console.log("request with")
    console.log(page)
    this.http.post("/api/front/regulation/list", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.Regulations = res.data;        
      }
      else{
        console.log(res.message);
      }
    })
   }

  onDepartmentSelectChange(): void {
    if(this.regSearchFormGroup.get("departmentId").value == null){
      this.regSearchFormGroup.patchValue({departmentId: ''});
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

