import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  userEditFormGroup: FormGroup;
  userId: number = 0;

  constructor(private ri: ActivatedRoute,
              private fb: FormBuilder,
              private http: HttpClient) {
    this.userEditFormGroup = this.fb.group({
      userName: [''],
      tel: [''],
      email: [''],
      department: [''],
      state: ['']
    })
               }

  ngOnInit() {
    this.ri.queryParams.subscribe((data: any)=>{
      this.userId = data["userId"];
      this.http.get("/api/user/detail", {
        params:{
          userId: this.userId.toString()
        }
      }).subscribe((user: any)=>{
        this.userEditFormGroup.patchValue({userName: user.userName});
        this.userEditFormGroup.patchValue({tel: user.tel});
        this.userEditFormGroup.patchValue({email: user.email});
        this.userEditFormGroup.patchValue({department: user.department});
        this.userEditFormGroup.patchValue({state: user.state});
      });
    });
  }

  onSubmit(): void{
    this.http.post("/api/user/edit", this.userEditFormGroup.value).subscribe((res:any)=>{
      console.log(res);
    });
  }
  onCancel(): void{
    
  }
}
