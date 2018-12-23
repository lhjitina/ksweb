import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarydetailComponent } from './summarydetail.component';

describe('SummarydetailComponent', () => {
  let component: SummarydetailComponent;
  let fixture: ComponentFixture<SummarydetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummarydetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
