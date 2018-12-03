import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulationdetailComponent } from './regulationdetail.component';

describe('RegulationdetailComponent', () => {
  let component: RegulationdetailComponent;
  let fixture: ComponentFixture<RegulationdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegulationdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegulationdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
