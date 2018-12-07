import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,  FormGroup, FormControl, AbstractControl, Validators} from '@angular/forms';
import { RegulationService } from '../regulation.service';
import { Observable } from 'rxjs';
import { BasicdataService } from '../basicdata.service';
import { Department } from '../basicdata';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-regulation',
  templateUrl: './regulation.component.html',
  styleUrls: ['./regulation.component.css']
})
export class RegulationComponent implements OnInit {

  public Regulations: Observable<Array<Regulation>>;
  public Departments: Observable<Department[]>;
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

    this.http.get("/api/regulation/list", {
      params: {
        name: this.RegSearchFormGroup.get("fileName").value,
        department: this.RegSearchFormGroup.get("department").value
    }}).subscribe((res: any)=>{
      this.Regulations = res;
    })

    this.Departments = this.basicdatasvc.getDepartments();
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
    this.regsvc.getRegList(this.fileName);
    //add a new line
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