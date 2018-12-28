import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Policy } from '../policy/policy.component';

@Component({
  selector: 'app-policydetail',
  templateUrl: './policydetail.component.html',
  styleUrls: ['./policydetail.component.css']
})
export class PolicydetailComponent implements OnInit {

  public policy: Policy = new Policy();
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
    this.policy.name = data["name"];
    this.policy.institution = data["institution"];
    this.policy.issueDate = data["date"];
    this.fromUrl = data["fromUrl"];
    
    this.docUrl = "/api/policy/content/" + this.policy.name;
    var dot = this.policy.name.lastIndexOf('.');
    this.docType = this.policy.name.slice(dot+1);
    console.log(this.docType)
    if (this.docType === 'jpg' || this.docType === 'gif' ||
        this.docType === 'png' || this.docType ==='jpeg' ||
        this.docType === 'bmp'){
          this.docType = 'img';
        }
  }

  onSave(): void{
    var url = "/api/policy/content/" + this.policy.name;
    this.http.get(url, { observe: 'body', responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = this.policy.name;
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
      this.rt.navigateByUrl("/portal/home/policy");
    } 
    else if (this.fromUrl === 'console'){
      this.rt.navigateByUrl("/portal/console/policy");
    }
  }
}
