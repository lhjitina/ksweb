import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,  FormGroup, FormControl, AbstractControl, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { RespData, RespPage, PageRequest } from './../../common/dto';
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
      this.searchFormGroup = this.fb.group({
        name: [''],
        startDate: [''],
        endDate: ['']
      });
              }

  ngOnInit() {

    this.onSearch();
  }

  onSearch(): void{
    var page = new PageRequest();
    page.append("name", this.searchFormGroup.get("name").value);

    this.http.post("/api/front/contract/list", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.contracts = res.data;
      }
      else{
        this.contracts = [];
        console.log(res.message);
      }
    }) 
  }

  onDownload(name: string): void{
    var url = "/api/contract/content/" + name;
    this.http.get(url, {responseType: 'blob'}).subscribe((res: Blob)=>{
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

