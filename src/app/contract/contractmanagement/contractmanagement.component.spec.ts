import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractmanagementComponent } from './contractmanagement.component';

describe('ContractmanagementComponent', () => {
  let component: ContractmanagementComponent;
  let fixture: ComponentFixture<ContractmanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
