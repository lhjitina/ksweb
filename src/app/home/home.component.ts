import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { User } from './../user/user-management/user-management.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private gs: GlobalService) { }

  ngOnInit() {
  }

  perCw(): boolean{
    return this.gs.getUser().perCw;
  }
  perCr(): boolean{
    return this.gs.getUser().perCr;
  }
  perUsr(): boolean{
    return this.gs.getUser().perUsr;
  }

}
