import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContracttemplateComponent } from './contracttemplate.component';

describe('ContracttemplateComponent', () => {
  let component: ContracttemplateComponent;
  let fixture: ComponentFixture<ContracttemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContracttemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContracttemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
