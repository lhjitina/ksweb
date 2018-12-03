import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsummaryComponent } from './meetingsummary.component';

describe('MeetingsummaryComponent', () => {
  let component: MeetingsummaryComponent;
  let fixture: ComponentFixture<MeetingsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
