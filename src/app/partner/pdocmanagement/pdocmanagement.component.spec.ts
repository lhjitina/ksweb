import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdocmanagementComponent } from './pdocmanagement.component';

describe('PdocmanagementComponent', () => {
  let component: PdocmanagementComponent;
  let fixture: ComponentFixture<PdocmanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdocmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdocmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
