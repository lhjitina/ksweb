import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { GlobalService } from '../global.service';
import { RespData } from './../common/dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginFormGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private http: HttpClient,
              private msg: NzMessageService,
              private gs: GlobalService) { 
    this.loginFormGroup = this.fb.group({
      loginName: [''],
      passwd: ['']
    });
  }

  ngOnInit() {
    console.log(".......login....init.....")
  }

  onSubmit(): void{
    console.log(this.loginFormGroup.value);
    this.http.post("/api/user/login", this.loginFormGroup.value, {observe: 'response'}).subscribe(
      (res: HttpResponse<any>)=>{
        console.log(res);
        if (res.status == 200){
          console.log("login return")
          const token = res.headers.get("authorization");
          const respData = res.body as RespData;
          if (respData.code == 0){
            console.log("login ok");
            this.gs.setToken(token);
            this.gs.setUser(respData.data)
            console.log(this.gs.getUser());
            console.log("route to shareinfo")
            this.router.navigateByUrl("/portal/home/shareinfo");
          }
          else{
            this.msg.create("error", respData.message);
          }
        }
        else{
          this.msg.create('error', res.statusText);
        }
      })
  }
}
