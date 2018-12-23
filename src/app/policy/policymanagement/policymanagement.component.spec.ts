import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicymanagementComponent } from './policymanagement.component';

describe('PolicymanagementComponent', () => {
  let component: PolicymanagementComponent;
  let fixture: ComponentFixture<PolicymanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicymanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicymanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
