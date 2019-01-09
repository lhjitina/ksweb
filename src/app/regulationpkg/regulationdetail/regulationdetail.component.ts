import { Component, OnInit, ElementRef } from '@angular/core';
import { Regulation } from '../regulation/regulation.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-regulationdetail',
  templateUrl: './regulationdetail.component.html',
  styleUrls: ['./regulationdetail.component.css']
})

export class RegulationdetailComponent implements OnInit {


  public reg: Regulation = new Regulation();
  public pdfUrl: any;
  public fromUrl: string;

  constructor(private routerInfo: ActivatedRoute,
              private http: HttpClient,
              private rt: Router) {

  }

  ngOnInit() {
    this.routerInfo.queryParams.subscribe((data: Params)=>this.getRouterParam(data));
  }

  getRouterParam(data: Params) : void{
    this.reg.name = data["name"];
    this.reg.departmentName = data["department"];
    this.reg.issueDate = data["date"];
    this.fromUrl = data["fromUrl"];
    this.pdfUrl = {
      url: "/api/regulation/content/" + this.reg.name,
      httpHeaders: { Authorization: 'Bearer XYZ' },
      withCredentials: true
    }
  }

  onSave(): void{
    var url = "/api/regulation/content/" + this.reg.name;
    this.http.get(url, { observe: 'body', responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = this.reg.name;
      a.click();
      URL.revokeObjectURL(a.href);
    })
  }

  onPrint(): void{
    var url = "/api/regulation/content/" + this.reg.name;
    this.http.get(url, { observe: 'body', responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "true";
      a.download = this.reg.name;
      a.click();
      URL.revokeObjectURL(a.href);
      URL.revokeObjectURL(href);
    })    

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
}
