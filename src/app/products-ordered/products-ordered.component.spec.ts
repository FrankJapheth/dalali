import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsOrderedComponent } from './products-ordered.component';

describe('ProductsOrderedComponent', () => {
  let component: ProductsOrderedComponent;
  let fixture: ComponentFixture<ProductsOrderedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsOrderedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsOrderedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
