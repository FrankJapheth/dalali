import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgelimiterComponent } from './agelimiter.component';

describe('AgelimiterComponent', () => {
  let component: AgelimiterComponent;
  let fixture: ComponentFixture<AgelimiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgelimiterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgelimiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
