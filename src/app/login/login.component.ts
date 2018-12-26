import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { GlobalService } from '../global.service';

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

  }

  onSubmit(): void{
    console.log(this.loginFormGroup.value);
    this.http.post("/api/login", this.loginFormGroup.value).subscribe((res: any)=>{
      if (res == 200){
        this.cookie.set("isLogin", "true");
        this.router.navigateByUrl("/portal/home");

      }
      else{
        this.msg.create('error', '登录失败！用户名或密码错误！');
      }
    })
  }
}
