import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PublicService } from 'src/app/service/public.service';
import { Department } from 'src/app/app.component';
import { User } from '../user-management/user-management.component';
import { NzMessageService } from 'ng-zorro-antd';

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
              private ps: PublicService,
              private router: Router,
              private message: NzMessageService) {

    this.userEditFormGroup = this.fb.group({
      id: [''],
      name: [''],
      tel: [''],
      email: [''],
      departmentId: [''],
      state: ['']
    })
  }

  ngOnInit() {
    this.ps.getDepartmentList().subscribe((res:any)=>{
      this.departments = res;
    });
    this.rt.queryParams.subscribe((data: any)=>{
      this.userEditFormGroup.patchValue({id: data["id"]});
      this.http.get("/api/user/detail", {
        params: {
          id: this.userEditFormGroup.get("id").value
        }
      }).subscribe((res: any)=>{
        var user: User= res;
        console.log(user);
        this.userEditFormGroup.patchValue({id: user.id});
        this.userEditFormGroup.patchValue({name: user.name});
        this.userEditFormGroup.patchValue({tel: user.tel});
        this.userEditFormGroup.patchValue({email: user.email});
        this.userEditFormGroup.patchValue({departmentId: user.departmentId});
        this.userEditFormGroup.patchValue({state: user.state});
        });
    });
  }

  onSubmit(): void{
    this.http.post("/api/user/update", this.userEditFormGroup.value).subscribe((res:any)=>{
      this.message.create('success', '用户信息修改成功');

    });
  }
  onGoBack(): void{
    this.router.navigateByUrl("/portal/console/user");
  }
}
