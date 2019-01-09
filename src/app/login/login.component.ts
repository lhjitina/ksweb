import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
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
              private cookie: CookieService,
              private msg: NzMessageService,
              private globalvar: GlobalService) { 
    this.loginFormGroup = this.fb.group({
      loginName: [''],
      passwd: ['']
    });
  }

  ngOnInit() {
    this.cookie.set("isLogin", "false");
    this.cookie.set("loginName", '');

  }

  onSubmit(): void{
    console.log(this.loginFormGroup.value);
    this.http.post("/api/login", this.loginFormGroup.value).subscribe(
      (res: RespData)=>{
        if (res.code == 0){
          this.cookie.set("isLogin", "true");
          this.cookie.set("loginName", this.loginFormGroup.get("loginName").value);
          this.router.navigateByUrl("/portal/home");
        }
        else{
          this.msg.create('error', res.message);
        }
      })
  }
}
