import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  hello: FormGroup;
  constructor(private fb: FormBuilder) {
    this.hello = this.fb.group({
      user:['']
    })

   }

  ngOnInit() {
  }

}
