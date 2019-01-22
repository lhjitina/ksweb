import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContracttemplatedetailComponent } from './contracttemplatedetail.component';

describe('ContracttemplatedetailComponent', () => {
  let component: ContracttemplatedetailComponent;
  let fixture: ComponentFixture<ContracttemplatedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContracttemplatedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContracttemplatedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
