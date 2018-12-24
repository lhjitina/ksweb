import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit {

  user: string = "guest";
  bShowPasswdModal: boolean = false;
  passwdFormGroup: FormGroup;
  processing: boolean = false;

  constructor(private cookie: CookieService,
              private modal: NzModalService,
              private fb: FormBuilder,
              private http: HttpClient,
              private message: NzMessageService) { 
    this.passwdFormGroup = this.fb.group({
      old: [''],
      new: ['']
    });
              }

  ngOnInit() {
    console.log("portal init")
    this.user = this.cookie.get("loginName");
    console.log("user:"+this.user)
  }
  onModifyPasswd(): void{
    console.log("modify passwd")
    this.bShowPasswdModal = true;
  }

  nzOnCancel(): void{
    this.bShowPasswdModal = false;
    this.passwdFormGroup.patchValue({odl: ''});
    this.passwdFormGroup.patchValue({new: ''});
  }

  onOk(): void{
    this.http.post("/api/passwd/modify", this.passwdFormGroup.value).subscribe((res: any)=>{
      if (res == "ok"){
        this.message.create('success', '密码修改成功.')
        this.bShowPasswdModal = false;
      }
      else{
        this.message.create('error', '密码修改失败!');
      }
    })
  }
}
