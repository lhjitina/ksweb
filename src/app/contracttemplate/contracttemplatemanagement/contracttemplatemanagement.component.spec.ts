import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContracttemplatemanagementComponent } from './contracttemplatemanagement.component';

describe('ContracttemplatemanagementComponent', () => {
  let component: ContracttemplatemanagementComponent;
  let fixture: ComponentFixture<ContracttemplatemanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContracttemplatemanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContracttemplatemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
