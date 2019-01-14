import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Summary } from '../summary/summary.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import * as Global from './../../globalvar';

@Component({
  selector: 'app-summarydetail',
  templateUrl: './summarydetail.component.html',
  styleUrls: ['./summarydetail.component.css']
})
export class SummarydetailComponent implements OnInit {

  public sum: Summary = new Summary();
  public fromUrl: string;  
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
    var url = "/api/summary/content/" + this.sum.name;
    this.http.get(url, { responseType: 'blob'}).subscribe((res: Blob)=>{
      this.content = res.slice(0, res.size, this.docType);
      (this.docType == "application/pdf")? this.pdfUrl = URL.createObjectURL(this.content) : this.pdfUrl='';
      (this.docType == "image/jpeg")? this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.content)) : this.safeUrl='';
    })
  }

  getRouterParam(data: Params) : void{
    this.sum.name = data["name"];
    this.sum.meetingDate = data["date"];
    this.fromUrl = data["fromUrl"];
    this.docType = Global.fileType(this.sum.name); 
  }

  onSave(): void{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(this.content);
      a.style.display = "false";
      a.download = this.sum.name;
      a.click();
      URL.revokeObjectURL(a.href);
  }

  onPrint(): void{
    var url = URL.createObjectURL(this.content);
    window.open(url).print();
    setTimeout(()=>{URL.revokeObjectURL(url)}, 2000);
  }

}

