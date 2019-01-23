import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { User } from './../user/user-management/user-management.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public perCR: boolean = false;
  public perCW: boolean = false;

  constructor(private gs: GlobalService) { }

  ngOnInit() {
    console.log("home init");
    let user = this.gs.getUser();
    if (user != null){
      this.perCR = this.gs.getUser().perCr;
      this.perCW = this.gs.getUser().perCw;
      console.log("home get user ");
      console.log(user);
    }
  }

}
