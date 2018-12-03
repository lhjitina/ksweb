import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownregComponent } from './downreg.component';

describe('DownregComponent', () => {
  let component: DownregComponent;
  let fixture: ComponentFixture<DownregComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownregComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
