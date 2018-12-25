import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  private bIsLogin: boolean = false;

  public test: string = "";
  
  public isLogin(): boolean {
    return this.bIsLogin;
  }

  public setLogin(state: boolean): void{
    this.bIsLogin = state;
  }
}
