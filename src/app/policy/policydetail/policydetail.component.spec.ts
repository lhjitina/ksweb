import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicydetailComponent } from './policydetail.component';

describe('PolicydetailComponent', () => {
  let component: PolicydetailComponent;
  let fixture: ComponentFixture<PolicydetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicydetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
