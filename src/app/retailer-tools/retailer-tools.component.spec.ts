import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerToolsComponent } from './retailer-tools.component';

describe('RetailerToolsComponent', () => {
  let component: RetailerToolsComponent;
  let fixture: ComponentFixture<RetailerToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailerToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
