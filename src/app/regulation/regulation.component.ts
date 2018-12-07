import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,  FormGroup, FormControl, AbstractControl, Validators} from '@angular/forms';
import { RegulationService } from '../regulation.service';
import { Observable } from 'rxjs';
import { BasicdataService } from '../basicdata.service';
import { Department } from '../basicdata';
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
  public PageSize: number = 2;
  private fileName: string="";
  private RegSearchFormGroup: FormGroup;

  constructor(private regsvc: RegulationService,
              private basicdatasvc: BasicdataService,
              private cdr: ChangeDetectorRef,
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
    
    this.regsvc.getRegulationContent(name).subscribe((data: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(data);
      a.style.display = "false";
      a.download = name + ".pdf";
      a.click();
      URL.revokeObjectURL(a.href);
      })   
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
  public Id: number;
  public Name: string;
  public Department: string;
  public PubDate: Date;
  public status: string;
constructor(
   ){

  }
}

export class RegulationDetail extends Regulation{
  public content: Blob;
}