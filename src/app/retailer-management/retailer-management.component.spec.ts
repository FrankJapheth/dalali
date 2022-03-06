import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerManagementComponent } from './retailer-management.component';

describe('RetailerManagementComponent', () => {
  let component: RetailerManagementComponent;
  let fixture: ComponentFixture<RetailerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailerManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
