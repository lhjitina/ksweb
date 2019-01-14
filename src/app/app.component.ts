import { Component } from '@angular/core';
import { GlobalService } from './global.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ksoa';

  constructor(){

  }

  ngOnInit(){

  }
}


export class Department{
  public id: number;
  public name: string;
}