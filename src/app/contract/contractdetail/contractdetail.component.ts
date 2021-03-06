import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Contract } from '../contract/contract.component';
import * as Global from './../../globalvar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contractdetail',
  templateUrl: './contractdetail.component.html',
  styleUrls: ['./contractdetail.component.css']
})
export class ContractdetailComponent implements OnInit {
  public contract: Contract = new Contract();
  public pdfUrl: any;
  public safeUrl: any;
  public docType: string;
  public content: Blob;

  constructor(private routerInfo: ActivatedRoute,
              private http: HttpClient,
              private rt: Router,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.routerInfo.queryParams.subscribe((data: Params)=>this.getRouterParam(data));
    var url = "/api/contract/content/" + this.contract.name;
    this.http.get(url, { responseType: 'blob'}).subscribe((res: Blob)=>{
      this.content = res.slice(0, res.size, this.docType);
      this.pdfUrl = URL.createObjectURL(this.content);
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.content));
    })
  }

  getRouterParam(data: Params) : void{
    this.contract.name = data["name"];
    this.docType = Global.fileType(this.contract.name);
  }

  onSave(): void{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(this.content);
      a.style.display = "false";
      a.download = this.contract.name;
      console.log("download file:" + a.download);
      a.click();
      URL.revokeObjectURL(a.href);
  }
}

