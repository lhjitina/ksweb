import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from '../user-management/user-management.component';
import * as MyValidator from '../../validators';
import { PublicService } from 'src/app/service/public.service';
import { Router } from '@angular/router';

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
              private http: HttpClient,
              private ps: PublicService,
              private rt: Router) {

    this.userAddFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(2)]],
      tel: ['', [Validators.required, MyValidator.mobielValidator]],
      email:['', [Validators.required, MyValidator.emailValidator] ],
      departmentId: ['', [Validators.required]],
    });
   }

  ngOnInit() {
    this.ps.getDepartmentList().subscribe((res: any)=>{
      this.departments = res;
    })
  }

  onSubmit(): void{
    if (!this.userAddFormGroup.valid){
      console.log("some value are invalid!!!")
      console.log(this.userAddFormGroup.errors)
      return;
    }

    console.log(this.userAddFormGroup.value);

    this.http.post("/api/user/add", this.userAddFormGroup.value).subscribe((res: any)=>{
      this.rt.navigateByUrl("/portal/console/user");
    });

  }

  onCancel(): void{
    this.rt.navigateByUrl("/portal/console/user");
  }
}
