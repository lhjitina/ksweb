import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,  FormGroup, FormControl, AbstractControl, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { RespData, RespPage, PageRequest } from './../../common/dto';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  public summaries: Array<Summary>;
  public sumSearchFormGroup: FormGroup;

  constructor(private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private http: HttpClient) {

              }

  ngOnInit() {
    this.sumSearchFormGroup = this.fb.group({
      name: [''],
      startDate: [''],
      endDate: ['']
    });
    this.onSearch();
  }

  onSearch(): void{
    var page = new PageRequest();

    var sd = this.sumSearchFormGroup.get("startDate").value;
    var ed = this.sumSearchFormGroup.get("endDate").value;
    if (moment.isDate(sd)) { 
      page.append("startDate", moment(sd).format("YYYY-MM-DD")) 
    };
    if (moment.isDate(ed)) { 
      page.append("endDate", moment(ed).format("YYYY-MM-DD")) 
    };
    page.append("name", this.sumSearchFormGroup.get("name").value);
    this.http.post("/api/front/regulation/list", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.summaries = res.data;        
      }
      else{
        console.log(res.message);
        this.summaries = [];
      }
    })
  }

  onDownload(name: string): void{
    var url = "/api/summary/content/" + name;
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


export class Summary {
  public name: string;
  public meetingDate: Date;
  public state: string;
  public operatorName: string;
  public operatorId: number;
  public operateTime: Date;
  
  constructor(){}

  public static clone(c: Summary){
    var r = new Summary();
    r.name = c.name;
    r.meetingDate = c.meetingDate;
    r.state = c.state;
    r.operateTime = c.operateTime;
    r.operatorId = c.operatorId;
    r.operatorName = c.operatorName;  
    return r;
  }
}

