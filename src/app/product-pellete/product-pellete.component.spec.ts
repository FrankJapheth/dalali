import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPelleteComponent } from './product-pellete.component';

describe('ProductPelleteComponent', () => {
  let component: ProductPelleteComponent;
  let fixture: ComponentFixture<ProductPelleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductPelleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPelleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
