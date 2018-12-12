import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulationmanagmentComponent } from './regulationmanagment.component';

describe('RegulationmanagmentComponent', () => {
  let component: RegulationmanagmentComponent;
  let fixture: ComponentFixture<RegulationmanagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegulationmanagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegulationmanagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
