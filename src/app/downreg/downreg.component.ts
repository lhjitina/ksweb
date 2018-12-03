import { Component, OnInit, Input, Injectable } from '@angular/core';

@Component({
  selector: 'app-downreg',
  templateUrl: './downreg.component.html',
  styleUrls: ['./downreg.component.css'],
  providers:[{provide: DownregComponent}]
})


export class DownregComponent implements OnInit {


  isVisible: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

}
