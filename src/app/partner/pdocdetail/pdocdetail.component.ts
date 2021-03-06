import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PartnerDoc } from './../pdoc/pdoc.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as Global from './../../globalvar';

@Component({
  selector: 'app-pdocdetail',
  templateUrl: './pdocdetail.component.html',
  styleUrls: ['./pdocdetail.component.css']
})
export class PdocdetailComponent implements OnInit {

  public pdoc: PartnerDoc = new PartnerDoc();
  public fromUrl: string;  
  public safeUrl: any;
  public pdfUrl: any;
  public docType: string;
  public content: Blob;

  constructor(private routerInfo: ActivatedRoute,
              private http: HttpClient,
              private rt: Router,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.routerInfo.queryParams.subscribe((data: Params)=>this.getRouterParam(data));
    var url = "/api/pdoc/content?name=" + this.pdoc.name + "&partner=" + this.pdoc.partner;
    this.http.get(url, { responseType: 'blob'}).subscribe((res: Blob)=>{
      this.content = res.slice(0, res.size, this.docType);
      (this.docType == "application/pdf")? this.pdfUrl = URL.createObjectURL(this.content) : this.pdfUrl='';
      (this.docType == "image/jpeg")? this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.content)) : this.safeUrl='';
    })
  }

  getRouterParam(data: Params) : void{
    this.pdoc.name = data["name"];
    this.pdoc.partner = data["partner"];
    this.fromUrl = data["fromUrl"];
    this.docType = Global.fileType(this.pdoc.name);  
  }

  onSave(): void{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(this.content);
      a.style.display = "false";
      a.download = this.pdoc.name;
      console.log("download file:" + a.download);
      a.click();
      URL.revokeObjectURL(a.href);
  }

}
