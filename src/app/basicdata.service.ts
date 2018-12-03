import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from './basicdata';

@Injectable({
  providedIn: 'root'
})
export class BasicdataService {

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>("/api/departments");
  }
}
