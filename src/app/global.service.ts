import { Injectable } from '@angular/core';
import { User } from './user/user-management/user-management.component';
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
  public unameSub: Subject<string> = new Subject<string>();
  constructor(private http: HttpClient,
              private rt: Router,
              private cs: CookieService) { 

    this.token = this.cs.get("token");
    if (this.token == null){ 
      this.token = '';
    }
    this.user.name = this.cs.get("uname");
    this.unameSub.next(this.user.name);

    console.log("saved token is " + this.token);
  }
  
  public verifyToken(): void{
    console.log("verify token...:" + this.token);
    this.http.get("/api/user/verifytoken").subscribe((res: RespData)=>{
      console.log("verify return");
      console.log(res);
      if (res != null && res.code == 0){
        this.user = res.data;
        this.unameSub.next(this.user.name);
        this.cs.set("uname", this.user.name, 1000, '/');
        console.log("verify token is ok, user is :");
        console.log(this.user);
      } 
      else{
        console.log(res);
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
    this.unameSub.next(user.name);

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
}
