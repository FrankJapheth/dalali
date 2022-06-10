import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSoldComponent } from './products-sold.component';

describe('ProductsSoldComponent', () => {
  let component: ProductsSoldComponent;
  let fixture: ComponentFixture<ProductsSoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsSoldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
