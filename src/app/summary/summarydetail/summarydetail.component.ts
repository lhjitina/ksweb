import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Summary } from '../summary/summary.component';


@Component({
  selector: 'app-summarydetail',
  templateUrl: './summarydetail.component.html',
  styleUrls: ['./summarydetail.component.css']
})
export class SummarydetailComponent implements OnInit {

  public sum: Summary = new Summary();
  public pdfUrl: string;

  constructor(private routerInfo: ActivatedRoute,
              private http: HttpClient
              ) {

  }

  ngOnInit() {
    this.routerInfo.queryParams.subscribe((data: Params)=>this.getRouterParam(data));
  }

  getRouterParam(data: Params) : void{
    this.sum.name = data["name"];
    this.sum.meetingDate = data["date"];

    this.pdfUrl = "/api/summary/content/" + this.sum.name;
  }

  onSave(): void{
    var url = "/api/summary/content/" + this.sum.name;
    this.http.get(url, { observe: 'body', responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = this.sum.name;
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

