import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Department } from 'src/app/app.component';
import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { DefaultRouteReuseStrategy } from '@angular/router/src/route_reuse_strategy';
import { PageRequest, RespPage } from './../../common/dto';
import { Router } from '@angular/router';
import { GlobalService, User } from 'src/app/global.service';
import { allowPreviousPlayerStylesMerge } from '@angular/animations/browser/src/util';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  userSearchFormGroup: FormGroup;
  fuzzySearchFormGroup: FormGroup;
  users: User[] = [];
  departments: Department[] = [];

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private messageService: NzMessageService,
              private modalService: NzModalService,
              private rt: Router,
              private gs: GlobalService) {
    this.userSearchFormGroup = this.fb.group({
      userName: [''],
      tel: [''],
      email: [''],
      departmentId:[''],
      state:['启用']
    });
    this.fuzzySearchFormGroup = this.fb.group({
      keys: ['']
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
    this.onSearch();
  }

  onSearch(): void{
    this.users=[];
    console.log("..."+ this.userSearchFormGroup.get("userName").value);
    var page = new PageRequest();
    page.append("name", this.userSearchFormGroup.get("userName").value);
    page.append("tel", this.userSearchFormGroup.get("tel").value);
    page.append("email", this.userSearchFormGroup.get("email").value);
    page.append("departmentId", this.userSearchFormGroup.get("departmentId").value);
    page.append("state", this.userSearchFormGroup.get("state").value);
    this.http.post("/api/user/list", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.users = res.data;
      }
      else{
        console.log(res.message);
      }
    })
  }

  onResetPasswd(user: User){
      this.modalService.confirm({
        nzTitle     : '重置密码',
        nzContent   : '您确定要为用户 "'+user.name+' " 重置密码吗?',
        nzOkText    : '确定',
        nzOkType    : 'danger',
        nzOnOk      : () => this.resetPasswd(user.id),
        nzCancelText: '取消',
     })
  }

  resetPasswd(uid: any){
    console.log("reset passwd uid="+uid);
    this.http.get("/api/user/passwd/reset", {
      params: {
        id: uid
      }
    }).subscribe((res: any)=>{
      this.messageService.create('success', '密码重置成功。')
    });
  }

  onDelete(user: User){
    this.modalService.confirm({
      nzTitle     : '删除用户',
      nzContent   : '您确定要删除用户 "'+user.name+' " 吗?',
      nzOkText    : '确定',
      nzOkType    : 'danger',
      nzOnOk      : () => this.deleteUser(user.id),
      nzCancelText: '取消',
      nzOnCancel  : () => console.log('Cancel')

    });
  }

  deleteUser(uid: any){
    this.http.get("/api/user/delete", {
      params: {
        id: uid
      }
    }).subscribe((res: any)=>{
      this.messageService.create('success', '删除用户成功！')
      this.onSearch();
    })
  }

  cardTitle(i: any, data: any): string{
    let info = data as User;
    i += 1;
    return "[" + i + "] " + info.name; 
  } 

  onFuzzySearch(): void{
    var page = new PageRequest();  
    page.append("keys", this.fuzzySearchFormGroup.get("keys").value);
    this.http.post("/api/user/fuzzy", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.users = res.data;
      }
      else{
        this.users = [];
      }
    })     
  }

  perUsr(): boolean{
    return this.gs.getUser().perUsr;
  }

  onClickCard(user: any): void{
    if (this.gs.getUser().perUsr){
      let u = user as User;
      this.rt.navigateByUrl("/portal/home/user", {queryParams:{'id': u.id}});
    }
  }
}
