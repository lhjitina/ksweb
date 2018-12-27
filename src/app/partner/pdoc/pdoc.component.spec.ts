import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdocComponent } from './pdoc.component';

describe('PdocComponent', () => {
  let component: PdocComponent;
  let fixture: ComponentFixture<PdocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
