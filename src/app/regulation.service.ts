import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Regulation, RegulationDetail } from './regulation/regulation.component';
import { Observable } from 'rxjs';

const baseUrl: string = "/api/regulation/"
const regListUrl: string = "/api/regulations"

@Injectable({
  providedIn: 'root'
})
export class RegulationService {

  constructor(private http: HttpClient) {

   }

   getRegList(): Observable<Array<Regulation>> {
     return this.http.get<Array<Regulation>>(regListUrl);
   }

   getRegulationContent(name: string): Observable<Blob>{
     var url: string = baseUrl + name;
     return this.http.get(url, { observe: 'body',  responseType: 'blob'});
   }
}
