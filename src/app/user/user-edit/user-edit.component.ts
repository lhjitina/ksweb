import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Department } from 'src/app/app.component';
import { User } from '../user-management/user-management.component';
import { NzMessageService } from 'ng-zorro-antd';
import * as MyValidator from '../../validators';
import { PageRequest, RespPage, RespData } from './../../common/dto';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  userEditFormGroup: FormGroup;
  departments: Department[] = [];

  constructor(private rt: ActivatedRoute,
              private fb: FormBuilder,
              private http: HttpClient,
              private router: Router,
              private message: NzMessageService) {

    this.userEditFormGroup = this.fb.group({
      id: ['0'],
      name: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(2)]],
      tel: ['', [Validators.required, MyValidator.mobielValidator]],
      email:['', [Validators.required, MyValidator.emailValidator] ],      
      departmentId: [''],
      state: [''],
      perPol: ['false'],
      perReg: ['false'],
      perSum: ['false'],
      perDoc: ['false'],
      perCon: ['false'],
      perUsr: ['false']
    })
  }

  ngOnInit() {
    console.log("user edit")
    this.http.post("/api/department/list", new PageRequest).subscribe((res: RespPage)=>{
      if (res.code == 0){
       this.departments = res.data;       
      }
      else{
        console.log(res.message);        
      }
    });
    this.rt.queryParams.subscribe((data: any)=>{
      this.userEditFormGroup.patchValue({id: data["id"]});
      console.log("user id=" + this.userEditFormGroup.get("id").value);
      this.http.get("/api/user/detail", {
        params: {
          id: this.userEditFormGroup.get("id").value
        }
      }).subscribe((res: RespData)=>{
        if (res.code == 0){
          var user: User= res.data;
          this.userEditFormGroup.patchValue({id: user.id});
          this.userEditFormGroup.patchValue({name: user.name});
          this.userEditFormGroup.patchValue({tel: user.tel});
          this.userEditFormGroup.patchValue({email: user.email});
          this.userEditFormGroup.patchValue({departmentId: user.departmentId});
          this.userEditFormGroup.patchValue({state: user.state});
          this.userEditFormGroup.patchValue({perPol: (user.perPol == 0)? false : true});
          this.userEditFormGroup.patchValue({perReg: (user.perReg == 0)? false : true});
          this.userEditFormGroup.patchValue({perSum: (user.perSum == 0)? false : true});
          this.userEditFormGroup.patchValue({perCon: (user.perCon == 0)? false : true});
          this.userEditFormGroup.patchValue({perUsr: (user.perUsr == 0)? false : true});
          this.userEditFormGroup.patchValue({perDoc: (user.perDoc == 0)? false : true});        }
        else{
          console.log(res.message);
        }
      });
    });
  }

  onSubmit(): void{
    if (!this.userEditFormGroup.valid){
      return;
    }

    this.http.post("/api/user/update", this.userEditFormGroup.value).subscribe((res: RespData)=>{
      if (res.code == 0){
        this.message.create('success', '用户信息修改成功');
      }
      else{
        this.message.create('error', res.message);
      }
    });
  }

}
