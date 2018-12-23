import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Policy } from '../policy/policy.component';

@Component({
  selector: 'app-policydetail',
  templateUrl: './policydetail.component.html',
  styleUrls: ['./policydetail.component.css']
})
export class PolicydetailComponent implements OnInit {

  private policy: Policy = new Policy();
  private pdfUrl: string;

  constructor(private routerInfo: ActivatedRoute,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.routerInfo.queryParams.subscribe((data: Params)=>this.getRouterParam(data));
  }

  getRouterParam(data: Params) : void{
    this.policy.name = data["name"];
    this.policy.institution = data["institution"];
    this.policy.issueDate = data["date"];

    this.pdfUrl = "/api/policy/content/" + this.policy.name;
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
    var w = window.open(this.pdfUrl);
    setTimeout(()=>{
      w.print();
      }, 2000);
  }
}
