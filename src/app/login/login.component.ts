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
      userName: [''],
      passwd: ['']
    });
  }

  ngOnInit() {

  }

  onSubmit(): void{
    this.http.post("/api/login", this.loginFormGroup.value).subscribe((res: any)=>{
      console.log("...loing return:" + res["username"]);
      this.cookie.set("userName", this.loginFormGroup.get("userName").value);
      this.router.navigateByUrl("/portal/home");
    })
  }
}
