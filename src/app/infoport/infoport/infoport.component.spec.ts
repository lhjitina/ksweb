import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoportComponent } from './infoport.component';

describe('InfoportComponent', () => {
  let component: InfoportComponent;
  let fixture: ComponentFixture<InfoportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
