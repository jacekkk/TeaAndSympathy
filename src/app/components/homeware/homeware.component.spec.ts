import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomewareComponent } from './homeware.component';

describe('HomewareComponent', () => {
  let component: HomewareComponent;
  let fixture: ComponentFixture<HomewareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomewareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomewareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
