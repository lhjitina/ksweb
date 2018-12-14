import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loginFormGroup: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router) { 
    this.loginFormGroup = this.fb.group({
      userName: [''],
      passwd: ['']
    });
  }

  ngOnInit() {
  }

  onSubmit(): void{
    this.router.navigateByUrl("/portal/home");
  }
}
