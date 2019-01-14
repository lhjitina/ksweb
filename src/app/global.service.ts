import { Injectable } from '@angular/core';
import { User } from './user/user-management/user-management.component';
import { HttpClient } from '@angular/common/http';
import { RespData } from './common/dto';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private token: string = '';
  private user: User = null;

  constructor(private http: HttpClient,
              private rt: Router,
              private cs: CookieService) { 

    this.token = this.cs.get("token");
    if (this.token == null){ 
      this.token = '';
    }
    console.log("saved token is " + this.token);
  }
  
  public verifyToken(oktodo: ()=>void, failtodo: ()=>void): void{
    console.log("verify token");
//    if (this.token !=''){
      console.log("verify token...:" + this.token);
      this.http.get("/api/user/verifytoken").subscribe((res: RespData)=>{
        console.log("verify return");
        console.log(res);
        if (res.code == 0){
          this.user = res.data;
          console.log("verify token is ok, user is :");
          console.log(this.user);
          oktodo();
        }
        else{
          console.log(res.message);
          this.user = null;
          this.token = '';
          this.setToken("");
          failtodo();
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
    this.user = user;
    console.log("set user:" + user);
  }
  public isLogin(): boolean {
    return this.token != '';
  }

  public logout(): void{
    console.log("logout, set token empty")
    this.token = '';
    this.user = null;
    this.setToken("");
    console.log("get token: " + this.cs.get("token"))
  }
}
