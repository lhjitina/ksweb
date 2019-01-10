import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Policy } from '../policy/policy.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import * as Global from './../../globalvar';

@Component({
  selector: 'app-policydetail',
  templateUrl: './policydetail.component.html',
  styleUrls: ['./policydetail.component.css']
})
export class PolicydetailComponent implements OnInit {

  public policy: Policy = new Policy();
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
    var url = "/api/regulation/content/" + this.policy.name;
    this.http.get(url, { responseType: 'blob'}).subscribe((res: Blob)=>{
      this.content = res.slice(0, res.size, this.docType);
      this.docUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.content));
    })}

  getRouterParam(data: Params) : void{
    this.policy.name = data["name"];
    this.policy.institution = data["institution"];
    this.policy.issueDate = data["date"];
    this.fromUrl = data["fromUrl"];
    this.docType = Global.fileType(this.policy.name); 
  }

  onSave(): void{
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.href = URL.createObjectURL(this.content);
    a.style.display = "false";
    a.download = this.policy.name;
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
      this.rt.navigateByUrl("/portal/home/policy");
    } 
    else if (this.fromUrl === 'console'){
      this.rt.navigateByUrl("/portal/console/policy");
    }
  }
}
