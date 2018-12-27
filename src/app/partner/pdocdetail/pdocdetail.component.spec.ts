import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdocdetailComponent } from './pdocdetail.component';

describe('PdocdetailComponent', () => {
  let component: PdocdetailComponent;
  let fixture: ComponentFixture<PdocdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdocdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdocdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
