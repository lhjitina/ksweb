import { Component, OnInit, ElementRef } from '@angular/core';
import { Regulation } from '../regulation/regulation.component';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-regulationdetail',
  templateUrl: './regulationdetail.component.html',
  styleUrls: ['./regulationdetail.component.css']
})

export class RegulationdetailComponent implements OnInit {


  private reg: Regulation = new Regulation();
  private pdfUrl: string;

  constructor(private routerInfo: ActivatedRoute,
              private http: HttpClient
              ) {

  }

  ngOnInit() {
    this.routerInfo.queryParams.subscribe((data: Params)=>this.getRouterParam(data));
  }

  getRouterParam(data: Params) : void{
    this.reg.name = data["name"];
    this.reg.departmentName = data["department"];
    this.reg.issueDate = data["date"];

    this.pdfUrl = "/api/regulation/content/" + this.reg.name;
  }

  onSave(): void{
    var url = "/api/regulation/content/" + this.reg.name;
    this.http.get(url, { observe: 'body', responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = this.reg.name + ".pdf";
      a.click();
      URL.revokeObjectURL(a.href);
    })
  }

  onPrint(): void{
    var w = window.open(this.pdfUrl);
    setTimeout(()=>{
      w.print();
      }, 2000);
  }
}
