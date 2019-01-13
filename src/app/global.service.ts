import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from './user/user-management/user-management.component';
import { HttpClient } from '@angular/common/http';
import { RespData } from './common/dto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private token: string = null;
  private user: User = null;

  constructor(private cookie: CookieService,
              private http: HttpClient,
              private rt: Router) { 
    this.token = this.cookie.get("token");
    console.log("saved token is " + this.token);

  }
  
  public verifyToken(): void{
    console.log("verify token");
    if (this.token != null && this.token !=''){
      console.log("verify token...:" + this.token);
      this.http.get("/api/user/verifytoken").subscribe((res: RespData)=>{
        if (res.code == 0){
          this.user = res.data;
          console.log("token is ok, user is :");
          console.log(this.user);
          this.rt.navigateByUrl("/portal/home/shareinfo")
        }
        else{
          console.log(res.message);
          this.user = null;
          this.token = null;
          this.cookie.delete("token");
        }
      })
    }
    else{
      console.log("token is null or empty");
      this.token = null;
      this.user = null;
    }
  }

  public getToken(): string{
    if (this.token == null){
      return '';
    }
    else{
      return this.token;
    }
  }
  public setToken(token: string): void{
    this.token = token;
    this.cookie.set("token", token);
    console.log("set and save token:" + token);
  }
  public getUser(): User{
    return this.user;
  }
  public setUser(user: User): void{
    this.user = user;
    console.log("set user:" + user);
  }
  public isLogin(): boolean {
    return this.user != null;
  }

  public logout(): void{
    this.token = null;
    this.user = null;
    this.cookie.delete("token");
  }
}
