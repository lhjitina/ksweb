import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  userSearchFormGroup: FormGroup;
  users: User[] = [];

  constructor(private fb: FormBuilder,
              private http: HttpClient) {
    this.userSearchFormGroup = this.fb.group({
      userName: [''],
      tel: [''],
      department:[''],
      state:['有效']
    })
   }

  ngOnInit() {
    this.onSearch();
  }

  onSearch(): void{
    this.users=[];
    console.log("..."+ this.userSearchFormGroup.get("userName").value);
    this.http.get("/api/user/list", {
      params:{
        userName: this.userSearchFormGroup.get("userName").value,
        tel: this.userSearchFormGroup.get("tel").value,
        department: this.userSearchFormGroup.get("department").value,
        state: this.userSearchFormGroup.get("state").value
      }
    }).subscribe((res: any)=>{
      this.users = res;
    })
  }

  onResetPasswd(id: number){
    
  }

  onDel(id: number){
    
  }
}

export class User{
  public userId: number;
  public userName: string;
  public department: string;
  public tel: string;
  public email: string;
  public role: string;
  public state: string;
  public priviledge: number[];
}