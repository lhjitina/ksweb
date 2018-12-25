import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import * as MyValidator from './../validators';


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
      oldp: [''],
      newPasswd: this.fb.group({
        newp: [''],
        confirm: ['']  
      }, {validator: MyValidator.passwdValidator})
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
    this.passwdFormGroup.patchValue({odlp: ''});
    this.passwdFormGroup.patchValue({newp: ''});
  }

  onOk(): void{
    console.log(this.passwdFormGroup.value);
    if (!this.passwdFormGroup.valid){
      console.log("new passwd invalid");
      return;    
    }
    var m = new Map().set("oldp", this.passwdFormGroup.get("oldp").value).set("newp", this.passwdFormGroup.get("newPasswd").get("newp").value);
    console.log(".......ppp")
    console.log(m);
    var bodystr = this.JsonFromMap(m);
    var body = JSON.parse(bodystr);
    console.log(body);
    this.http.post("/api/user/passwd/modify", body).subscribe((res: any)=>{
      if (res == 200){
        this.message.create('success', '密码修改成功.')
        this.bShowPasswdModal = false;
      }
      else{
        this.message.create('error', '密码修改失败!');
      }
    })
  }

  JsonFromMap(m: Map<string, string>): string{
    var str = '{';
    m.forEach((v, k, mm)=>{
      str += '"' + k + '":"' + v + '",'
    })
    if (str.length > 1){
      str = str.slice(0, str.length - 1);
    }
    str += "}";
    return str;
  }
}
