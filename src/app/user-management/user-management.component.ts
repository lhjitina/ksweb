import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  userSearchFormGroup: FormGroup;
  users: User[] = [];

  constructor(private fb: FormBuilder) {
    this.userSearchFormGroup = this.fb.group({
      userName: [''],
      tel: [''],
      email: [''],
      department:[''],
      state:['']
    })
   }

  ngOnInit() {
  }

  onSearch(): void{

  }

  onAdd(): void {

  }
}

export class User{
  public userId: number;
  public userName: string;
  public realName: string;
  public sex: number;
  public department: string;
  public tel: string;
  public email: string;
  public role: string;
  public state: string;
  public priviledge: number[];
}