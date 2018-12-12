import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-meetingsummary',
  templateUrl: './meetingsummary.component.html',
  styleUrls: ['./meetingsummary.component.css']
})
export class MeetingsummaryComponent implements OnInit {

  constructor(private http: HttpClient) { }
  userName: string;

  ngOnInit() {
  }

  sessionTest(): void{
    this.http.get("/api/session").subscribe((res: any)=>{
      this.userName = res["username"];
    });
  }
}
