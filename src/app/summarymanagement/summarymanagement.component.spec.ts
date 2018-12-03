import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarymanagementComponent } from './summarymanagement.component';

describe('SummarymanagementComponent', () => {
  let component: SummarymanagementComponent;
  let fixture: ComponentFixture<SummarymanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummarymanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarymanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
