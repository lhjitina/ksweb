import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,  FormGroup, FormControl, AbstractControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { RespData, RespPage, PageRequest } from './../../common/dto';

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
      partner: [''],
    });
    this.onSearch();
  }

  onSearch(): void{
    var page = new PageRequest();  
    page.append("name", this.searchFormGroup.get("fileName").value);
    page.append("partner", this.searchFormGroup.get("partner").value);

    this.http.post("/api/front/pdoc/list", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.pdocs = res.data;
      }
      else{
        this.pdocs = [];
      }
    }) 
  }

  onDownload(pdoc: PartnerDoc): void{
    var url = "/api/pdoc/content?name=" + pdoc.name + "&partner=" + pdoc.partner;
    this.http.get(url, {responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = pdoc.name;
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

