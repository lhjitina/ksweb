import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  token: string = null;

  constructor(private http: HttpClient) { }

  getDepartmentList(): Observable<any>{
    return this.http.get("/api/department/list");
  }

  public getToken(): string{
    return this.token;
  }

  public setToken(token: string){
    this.token = token;
  }
}
