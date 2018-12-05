import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Regulation, RegulationDetail } from './regulation/regulation.component';
import { Observable } from 'rxjs';

const baseUrl: string = "/api/regulation/"
const regListUrl: string = "/api/regulation/list"

@Injectable({
  providedIn: 'root'
})
export class RegulationService {

  constructor(private http: HttpClient) {

   }

   getRegList(name: string): Observable<Array<Regulation>> {
     const params = new HttpParams().set("name", name);
     console.log("....get list with name=...." + name);
     return this.http.get<Array<Regulation>>(regListUrl, {params});
   }

   getRegulationContent(name: string): Observable<Blob>{
     var url: string = baseUrl + name;
     return this.http.get(url, { observe: 'body',  responseType: 'blob'});
   }
}
