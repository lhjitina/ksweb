import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

  userAddFormGroup: FormGroup;
  departments: string[] = [];

  constructor(private fb: FormBuilder,
              private http: HttpClient) {
    this.userAddFormGroup = this.fb.group({
      userName: [''],
      passwd: [''],
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
    this.http.post("/api/user/add", this.userAddFormGroup.value).subscribe((res)=>{
      console.log("add user ret.."+ res);
    })
  }

  onCancel(): void{

  }
}
