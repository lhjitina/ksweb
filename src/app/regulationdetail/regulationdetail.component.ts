import { Component, OnInit, ElementRef } from '@angular/core';
import { Regulation, RegulationDetail } from '../regulation/regulation.component';
import { ActivatedRoute, Params } from '@angular/router';
import { RegulationService } from '../regulation.service';
import { DownregComponent } from '../downreg/downreg.component';
import { BlockingProxy } from 'blocking-proxy';

const svrUrl = "/api/regulation/";
@Component({
  selector: 'app-regulationdetail',
  templateUrl: './regulationdetail.component.html',
  styleUrls: ['./regulationdetail.component.css']
})

export class RegulationdetailComponent implements OnInit {


  private reg: Regulation = new Regulation();
  private pdfUrl: string = svrUrl;

  constructor(private routerInfo: ActivatedRoute,
              private regsvc: RegulationService,
              private el: ElementRef
              ) {

  }

  ngOnInit() {
    this.routerInfo.queryParams.subscribe((data: Params)=>this.getRouterParam(data));
    console.log(".....I am reg detail.....")
  }

  getRouterParam(data: Params) : void{
    this.reg.Name = data["name"];
    this.reg.Department = data["department"];
    this.reg.PubDate = data["date"];
    this.reg.status = data["status"];

    this.pdfUrl = svrUrl + this.reg.Name;
  }

  onDownload(): void{
    this.regsvc.getRegulationContent(this.reg.Name).subscribe((data: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(data);
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
