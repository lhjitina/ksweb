import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Contract } from '../contract/contract.component';

@Component({
  selector: 'app-contractdetail',
  templateUrl: './contractdetail.component.html',
  styleUrls: ['./contractdetail.component.css']
})
export class ContractdetailComponent implements OnInit {

  public contract: Contract = new Contract();
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
    this.contract.name = data["name"];
    this.contract.issueDate = data["date"];
    this.fromUrl = data["fromUrl"];
    
    this.docUrl = "/api/contract/content/" + this.contract.name;
    var dot = this.contract.name.lastIndexOf('.');
    this.docType = this.contract.name.slice(dot+1);
    console.log(this.docType)
    if (this.docType === 'jpg' || this.docType === 'gif' ||
        this.docType === 'png' || this.docType ==='jpeg' ||
        this.docType === 'bmp'){
      this.docType = 'img';
    }
  }

  onSave(): void{
    var url = "/api/contract/content/" + this.contract.name;
    this.http.get(url, { observe: 'body', responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = this.contract.name;
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
      this.rt.navigateByUrl("/portal/home/contract");
    } 
    else if (this.fromUrl === 'console'){
      this.rt.navigateByUrl("/portal/console/contract");
    }
  }
}

