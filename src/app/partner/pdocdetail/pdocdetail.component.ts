import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PartnerDoc } from './../pdoc/pdoc.component';

@Component({
  selector: 'app-pdocdetail',
  templateUrl: './pdocdetail.component.html',
  styleUrls: ['./pdocdetail.component.css']
})
export class PdocdetailComponent implements OnInit {

  public pdoc: PartnerDoc = new PartnerDoc();
  public docUrl: string;
  public docType: string;
  public fromUrl: string;

  constructor(private routerInfo: ActivatedRoute,
              private http: HttpClient,
              private rt: Router) {
  }

  ngOnInit() {
    this.routerInfo.queryParams.subscribe((data: Params)=>this.getRouterParam(data));
  }

  getRouterParam(data: Params) : void{
    this.pdoc.name = data["name"];
    this.pdoc.partner = data["partner"];
    this.fromUrl = data["fromUrl"];

    this.docUrl = "/api/pdoc/content?name=" + this.pdoc.name + "&partner=" + this.pdoc.partner;
    var dot = this.pdoc.name.lastIndexOf('.');
    this.docType = this.pdoc.name.slice(dot+1);
    console.log(this.docType)
    if (this.docType === 'jpg' || this.docType === 'gif' ||
        this.docType === 'png' || this.docType ==='jpeg' ||
        this.docType === 'bmp'){
      this.docType = 'img';
    }
  }

  onSave(): void{
     this.http.get("/api/pdoc/content", { params: {
      name: this.pdoc.name,
      partner: this.pdoc.partner
    }, observe: 'body', responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = this.pdoc.name;
      console.log("download file:" + a.download);
      a.click();
      URL.revokeObjectURL(a.href);
    })
  }

  onPrint(): void{
    var w = window.open(this.docUrl);
    setTimeout(()=>{
      w.print();
      }, 2000);
  }

  onGoback(): void{
    console.log("fromUrl="+this.fromUrl);
    if (this.fromUrl === 'home'){
      this.rt.navigateByUrl("/portal/home/partnerdoc");
    } 
    else if (this.fromUrl === 'console'){
      this.rt.navigateByUrl("/portal/console/partnerdoc");
    }
  }
}
