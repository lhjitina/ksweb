import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from '../user-management/user-management.component';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

  userAddFormGroup: FormGroup;
  departments: string[] = [];
  users: Array<User> = new Array<User>();

  constructor(private fb: FormBuilder,
              private http: HttpClient) {
    this.userAddFormGroup = this.fb.group({
      userName: [''],
      tel: [''],
      email:[''],
      realName: [''],
      department: [''],
      state: ['有效']
    });
   }

  ngOnInit() {
  }

  onSubmit(): void{
    console.log(this.userAddFormGroup.value);
    this.http.post("/api/user/add", this.userAddFormGroup.value).subscribe((res: number)=>{
      if (res == 200){
        this.http.get("/api/user/list", {
            params:{
              userName: this.userAddFormGroup.get("userName").value
            }
          }).subscribe((res: any)=>{
            console.log("...add ret..." + res);
            let user: Array<User> = res;
            this.users= user.concat(this.users);
          });
      };

    });

  }

  onCancel(): void{

  }
}
