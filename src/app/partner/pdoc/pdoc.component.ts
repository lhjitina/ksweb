import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,  FormGroup, FormControl, AbstractControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-pdoc',
  templateUrl: './pdoc.component.html',
  styleUrls: ['./pdoc.component.css']
})
export class PdocComponent implements OnInit {

  public pdocs: Array<PartnerDoc>;
  public searchFormGroup: FormGroup;

  constructor(private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private http: HttpClient) {

              }

  ngOnInit() {
    this.searchFormGroup = this.fb.group({
      fileName: [''],
      institution: [''],
      startDate: [''],
      endDate: ['']
    });
    this.onSearch();
  }

  onSearch(): void{
    this.http.get("/api/front/pdoc/list", {
      params: {
        name: this.searchFormGroup.get("fileName").value,
        partner: this.searchFormGroup.get("partner").value,
      }
    }).subscribe((res: any)=>{
      this.pdocs = res;
    }) 
  }

  onDownload(pdoc: PartnerDoc): void{
    this.http.get("/api/pdoc/content", {params:{
      name: pdoc.name,
      partner: pdoc.partner
    }, observe: 'body', responseType: 'blob'}).subscribe((res: Blob)=>{
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


export class PartnerDoc {
  public name: string;
  public partner: string;
  public operatorName: string;
  public operatorId: number;
  public operateTime: Date;
  
  constructor(){}

  public static clone(c: PartnerDoc){
    var r = new PartnerDoc();
    r.name = c.name;
    r.partner = c.partner;
    r.operateTime = c.operateTime;
    r.operatorId = c.operatorId;
    r.operatorName = c.operatorName;  
    return r;
  }
}

