import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RespData } from './common/dto';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private token: string = '';
  private user: User = new User();
  private initUrl: string = '/';

  constructor(private http: HttpClient,
              private rt: Router,
              private cs: CookieService) { 

    this.token = this.cs.get("token");
    if (this.token == null){ 
      this.token = '';
    }
    console.log("saved token is " + this.token);
  }
  
  public verifyToken(): void{
    console.log("verify token...:" + this.token);
    this.http.get("/api/user/verifytoken").subscribe((res: RespData)=>{
      console.log("verify return");
      console.log(res);
      if (res != null && res.code == 0){
        this.user = res.data;
        this.cs.set("uname", this.user.name, 1000, '/');
        console.log("verify token is ok, user is :");
        console.log(this.user);
        this.rt.navigateByUrl(this.initUrl);
      } 
      else{
        console.log(res);
        this.rt.navigateByUrl("/login");
      }
    })
  }

  public getToken(): string{
      return this.token;
  }

  public setToken(token: string): void{
    this.token = token;
    this.cs.set("token", token, 1000, '/');
    console.log("set and save token:" + token);
    console.log("get right now: " + this.cs.get("token"))
  
  }
  public getUser(): User{
    return this.user;
  }
  public setUser(user: User): void{
    console.log("set user:");
    console.log(user);    
    this.user = user;
    this.cs.set("uname", this.user.name, 1000, '/');
  }
  
  public isLogin(): boolean {
    return this.user.name != null && this.user.name.trim().length != 0;
  }

  public logout(): void{
    console.log("logout, set token empty")
    this.token = '';
    this.user = null;
    this.setToken("");
    this.cs.set("uname", '', 1000, '/');
    console.log("get token: " + this.cs.get("token"))
  }

  public getInitUrl(): string{
    return this.initUrl;
  }

  public setInitUrl(url: string): void{
    this.initUrl = url;
  }
}


export class User{
  public id: number;
  public name: string;
  public departmentId: number;
  public departmentName: string;
  public tel: string;
  public email: string;
  public state: string;
  public registTime: Date;
  public lastLoginTime: Date;
  public perPol: boolean;
  public perReg: boolean;
  public perSum: boolean;
  public perUsr: boolean;
  public perCon: boolean;
  public perDoc: boolean;
  public perCw: boolean;
  public perCr: boolean;
}
