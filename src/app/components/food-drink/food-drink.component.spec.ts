import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodDrinkComponent } from './food-drink.component';

describe('FoodDrinkComponent', () => {
  let component: FoodDrinkComponent;
  let fixture: ComponentFixture<FoodDrinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodDrinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodDrinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
