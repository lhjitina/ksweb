import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from '../user-management/user-management.component';
import * as MyValidator from '../../validators';

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
      userName: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(2)]],
      tel: ['', [Validators.required, MyValidator.mobielValidator]],
      email:['', [Validators.required, MyValidator.emailValidator] ],
      department: ['', [Validators.required]],
    });
   }

  ngOnInit() {
    this.http.get("/api/department/list").subscribe((res: any)=>{
      this.departments = res;
    });
  }

  onSubmit(): void{
    if (!this.userAddFormGroup.valid){
      console.log("some value are invalid!!!")
      return;
    }

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
