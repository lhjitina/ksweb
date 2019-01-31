import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from '../user-management/user-management.component';
import * as MyValidator from '../../validators';
import { Router } from '@angular/router';
import { PageRequest, RespPage, RespData} from './../../common/dto';
import { NzMessageService } from 'ng-zorro-antd';

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
              private rt: Router,
              private msg: NzMessageService) {

    this.userAddFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(2)]],
      tel: ['', [Validators.required, MyValidator.mobielValidator]],
      email:['', [Validators.required, MyValidator.emailValidator] ],
      departmentId: [''],
      state: ['启用'],
      perPol: ['false'],
      perReg: ['false'],
      perSum: ['false'],
      perDoc: ['false'],
      perCon: ['false'],
      perUsr: ['false'],
      perCw: ['false'],
      perCr: ['false']
    });
   }

  ngOnInit() {
    this.http.post("/api/department/list", new PageRequest).subscribe((res: RespPage)=>{
      if (res.code == 0){
       this.departments = res.data;       
      }
      else{
        console.log(res.message);        
      }
    });
  }

  onSubmit(): void{
    if (!this.userAddFormGroup.valid){
      console.log("some value are invalid!!!")
      console.log(this.userAddFormGroup.errors)
      return;
    }

    console.log(this.userAddFormGroup.value);

    this.http.post("/api/user/add", this.userAddFormGroup.value).subscribe((res: RespData)=>{
      if (res.code == 0){
        this.rt.navigateByUrl("/portal/home/user");
      }
      else{
        this.msg.create('error', "添加用户失败！(" + res.message + ")");
      }
     });
  }

}
