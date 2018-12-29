import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,  FormGroup, FormControl, AbstractControl, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {

  public contracts: Array<Contract>;
  public searchFormGroup: FormGroup;

  constructor(private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private http: HttpClient) {

              }

  ngOnInit() {
    this.searchFormGroup = this.fb.group({
      name: [''],
      startDate: [''],
      endDate: ['']
    });
    this.onSearch();
  }

  onSearch(): void{
    this.http.get("/api/front/contract/list", {
      params: {
        name: this.searchFormGroup.get("name").value,
      }
    }).subscribe((res: any)=>{
      this.contracts = res;
    }) 
  }

  onDownload(name: string): void{
    var url = "/api/contract/content/" + name;
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


export class Contract {
  public name: string;
  public state: string;
  public issueDate: Date;
  public operatorName: string;
  public operatorId: number;
  public operateTime: Date;
  
  constructor(){}
  public static clone(c: Contract){
    var r = new Contract();
    r.name = c.name;
    r.issueDate = c.issueDate;
    r.state = c.state;
    r.operateTime = c.operateTime;
    r.operatorId = c.operatorId;
    r.operatorName = c.operatorName;  
    return r;
  }}

