import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router, UrlSerializer } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ShareInfo } from './../infoport/infoport.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import * as Global from './../../globalvar';

@Component({
  selector: 'app-infdetail',
  templateUrl: './infdetail.component.html',
  styleUrls: ['./infdetail.component.css']
})
export class InfdetailComponent implements OnInit {
  public info: ShareInfo = new ShareInfo();
  public pdfUrl: any;  
  public safeUrl: SafeResourceUrl;
  public docType: string;
  public content: Blob;



  constructor(private routerInfo: ActivatedRoute,
              private http: HttpClient,
              private rt: Router,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.routerInfo.queryParams.subscribe((data: Params)=>this.getRouterParam(data));
    var url = "/api/share/content?name=" + this.info.name;
    this.http.get(url, { observe: 'body', responseType: 'blob'}).subscribe((res: any)=>{
        this.content = res.slice(0, res.size, this.docType);
        this.pdfUrl = (URL.createObjectURL(this.content));
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.content));
    })
  }

  getRouterParam(data: Params) : void{
    this.info.name = data["name"];
    this.info.tag = data["tag"];
    this.docType = Global.fileType(this.info.name); 
  }

  onSave(): void{
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.href = URL.createObjectURL(this.content);
    a.style.display = "false";
    a.download = this.info.name;
    a.click();
    URL.revokeObjectURL(a.href);  
  }
}
