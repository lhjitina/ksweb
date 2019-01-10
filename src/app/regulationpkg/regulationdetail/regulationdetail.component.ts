import { Component, OnInit, ElementRef } from '@angular/core';
import { Regulation } from '../regulation/regulation.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as Global from './../../globalvar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-regulationdetail',
  templateUrl: './regulationdetail.component.html',
  styleUrls: ['./regulationdetail.component.css']
})

export class RegulationdetailComponent implements OnInit {


  public reg = new Regulation();
  public fromUrl: string;  
  public docUrl: any;
  public docType: string;
  public content: Blob;

  constructor(private routerInfo: ActivatedRoute,
              private http: HttpClient,
              private rt: Router,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.routerInfo.queryParams.subscribe((data: Params)=>this.getRouterParam(data));

    var url = "/api/regulation/content/" + this.reg.name;
    this.http.get(url, { responseType: 'blob'}).subscribe((res: Blob)=>{
      this.content = res.slice(0, res.size, this.docType);
      this.docUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.content));
    })
  }

  getRouterParam(data: Params) : void{
    this.reg.name = data["name"];
    this.reg.departmentName = data["department"];
    this.reg.issueDate = data["date"];
    this.fromUrl = data["fromUrl"];
    this.docType = Global.fileType(this.reg.name);   
  }

  onSave(): void{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(this.content);
      a.style.display = "false";
      a.download = this.reg.name;
      a.click();
      URL.revokeObjectURL(a.href);
  }

  onPrint(): void{
    var url = URL.createObjectURL(this.content);
    window.open(url).print();
    setTimeout(()=>{URL.revokeObjectURL(url)}, 2000);
  }

  onGoback(): void{
    console.log("fromUrl="+this.fromUrl);
    if (this.fromUrl === 'home'){
      this.rt.navigateByUrl("/portal/home/regulation");
    } 
    else if (this.fromUrl === 'console'){
      this.rt.navigateByUrl("/portal/console/regulation");
    }
  }

  ngOnDestroy(){
    URL.revokeObjectURL(this.docUrl);
  }
}
