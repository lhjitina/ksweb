import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractdetailComponent } from './contractdetail.component';

describe('ContractdetailComponent', () => {
  let component: ContractdetailComponent;
  let fixture: ComponentFixture<ContractdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
