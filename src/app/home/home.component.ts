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
    this.gs.userSub.subscribe((user: User)=>{
      this.perCR = user.perCr;
      this.perCW = user.perCw;
      console.log("home init ");
      console.log(user);
    })
  }

}
