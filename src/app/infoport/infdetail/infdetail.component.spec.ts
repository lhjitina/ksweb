import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfdetailComponent } from './infdetail.component';

describe('InfdetailComponent', () => {
  let component: InfdetailComponent;
  let fixture: ComponentFixture<InfdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
