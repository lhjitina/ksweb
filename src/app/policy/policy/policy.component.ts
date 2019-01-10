import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup,  Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { RespData, RespPage, PageRequest } from './../../common/dto';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})

export class PolicyComponent implements OnInit {
  public policies: Array<Policy>;
  public searchFormGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private http: HttpClient) {

              }

  ngOnInit() {
    this.searchFormGroup = this.fb.group({
      name: [''],
      institution: [''],
      startDate: [''],
      endDate: ['']
    });
    this.onSearch();
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
    page.append("institution", this.searchFormGroup.get("institution").value);
    this.http.post("/api/front/policy/list", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.policies = res.data;        
      }
      else{
        console.log(res.message);
        this.policies = [];
      }
    })  
  }

  onDownload(name: string): void{
    var url = "/api/policy/content/" + name;
    this.http.get(url, { responseType: 'blob'}).subscribe((res: Blob)=>{
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


export class Policy {
  public name: string;
  public institution: string;
  public issueDate: Date;
  public state: string;
  public operatorName: string;
  public operatorId: number;
  public operateTime: Date;
  
  constructor(){}

  public static clone(c: Policy){
    var r = new Policy();
    r.name = c.name;
    r.institution = c.institution;
    r.issueDate = c.issueDate;
    r.state = c.state;
    r.operateTime = c.operateTime;
    r.operatorId = c.operatorId;
    r.operatorName = c.operatorName;  
    return r;
  }
}

