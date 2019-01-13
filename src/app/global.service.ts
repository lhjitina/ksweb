import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from './user/user-management/user-management.component';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private token: string;
  public uname: string;
  private bIsLogin: boolean = false;

  constructor(private cookie: CookieService) { 
    this.token = this.cookie.get("token");
    this.uname = this.cookie.get("uname");
  }
  
  public getToken(): string{
    return this.token;
  }
  public setToken(token: string): void{
    this.token = token;
    this.cookie.set("token", token);
  }
  public getUname(): string{
    return this.uname;
  }
  public setUname(uname: string): void{
    this.uname = uname;
    this.cookie.set("uname", uname);
  }
  public isLogin(): boolean {
    return this.bIsLogin;
  }

  public setLogin(state: boolean): void{
    this.bIsLogin = state;
  }
}
