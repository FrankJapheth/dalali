import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaysProductSoldComponent } from './days-product-sold.component';

describe('DaysProductSoldComponent', () => {
  let component: DaysProductSoldComponent;
  let fixture: ComponentFixture<DaysProductSoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaysProductSoldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaysProductSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
