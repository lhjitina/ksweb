import { Component, OnInit } from '@angular/core';
import { RegulationService } from '../regulation.service';
import { Regulation } from './../regulation/regulation.component';

@Component({
  selector: 'app-regulationmanagment',
  templateUrl: './regulationmanagment.component.html',
  styleUrls: ['./regulationmanagment.component.css']
})
export class RegulationmanagmentComponent implements OnInit {

  prefixUser: string ="文件名称";
  userDepartment: string = "方案策划部";

  constructor(private regsvc: RegulationService) { }

  ngOnInit() {
  }

}

export class RegmgtRecord extends Regulation{
  public operator: string;
  public opTime: Date;
}
