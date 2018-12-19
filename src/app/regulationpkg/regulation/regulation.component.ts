import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,  FormGroup, FormControl, AbstractControl, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-regulation',
  templateUrl: './regulation.component.html',
  styleUrls: ['./regulation.component.css']
})
export class RegulationComponent implements OnInit {

  public Regulations: Array<Regulation>;
  public Departments: string[];
  public pageSize: number = 2;
  private RegSearchFormGroup: FormGroup;

  constructor(private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private http: HttpClient) {

              }

  ngOnInit() {
    this.RegSearchFormGroup = this.fb.group({
      fileName: [''],
      department: [''],
      startDate: [''],
      endDate: ['']
    });

    this.http.get("/api/regulation/list").subscribe((res: any)=>{
      this.Regulations = res;
    })

    this.http.get("/api/department/list").subscribe((res: any)=>{
      this.Departments = res;
    })
  }


  onDownload(name: string): void{
    var url = "/api/regulation/content/" + name;
    this.http.get(url, { observe: 'body', responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = name + ".pdf";
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  onSearch(): void{
    var sd = this.RegSearchFormGroup.get("startDate").value;
    var ed = this.RegSearchFormGroup.get("endDate").value;
    moment.isDate(sd) ? sd = moment(sd).format("YYYY-MM-DD") : sd = "";
    moment.isDate(ed) ? ed = moment(ed).format("YYYY-MM-DD") : ed = "";
    this.http.get("/api/regulation/list", {
      params: {
        name: this.RegSearchFormGroup.get("fileName").value,
        department: this.RegSearchFormGroup.get("department").value,
        startDate: sd,
        endDate: ed
      }
    }).subscribe((res: any)=>{
      this.Regulations = res;
    })
  
  }
}


export class Regulation {
  public name: string;
  public department: string;
  public issueDate: Date;
  public state: string;
  public operator: string;
  public operateTime: Date;
  
constructor(
   ){

  }
}

