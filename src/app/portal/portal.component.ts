import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit {

  userName: string = "guest";

  constructor(private cookie: CookieService) { }

  ngOnInit() {
    this.userName = this.cookie.get("userName");
  }

}
