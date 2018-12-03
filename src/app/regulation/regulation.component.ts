import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,  FormGroup, FormControl, AbstractControl, Validators} from '@angular/forms';
import { RegulationService } from '../regulation.service';
import { Observable } from 'rxjs';
import { BasicdataService } from '../basicdata.service';
import { Department } from '../basicdata';

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

  constructor(private regsvc: RegulationService,
              private basicdatasvc: BasicdataService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.Regulations = this.regsvc.getRegList();
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
    console.log("........a."+ this.fileName + ".b.......");
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