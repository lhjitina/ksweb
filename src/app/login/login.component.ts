import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loginFormGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private http: HttpClient,
              private cookie: CookieService) { 
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
        console.log("login ok");
      }
      this.cookie.set("loginName", this.loginFormGroup.get("loginName").value);
      this.router.navigateByUrl("/portal/home");
    })
  }
}
