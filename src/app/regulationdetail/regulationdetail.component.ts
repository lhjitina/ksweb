import { Component, OnInit, ElementRef } from '@angular/core';
import { Regulation, RegulationDetail } from '../regulation/regulation.component';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RegulationService } from '../regulation.service';
import { DownregComponent } from '../downreg/downreg.component';
import { BlockingProxy } from 'blocking-proxy';


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
    this.reg.Name = data["name"];
    this.reg.Department = data["department"];
    this.reg.PubDate = data["date"];
    this.reg.status = data["status"];

    this.pdfUrl = "/api/regulation/content/" + this.reg.Name;
  }

  onSave(): void{
    var url = "/api/regulation/content/" + this.reg.Name;
    this.http.get(url, { observe: 'body', responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = this.reg.Name + ".pdf";
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
