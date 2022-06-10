import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DalaliCalenderComponent } from './dalali-calender.component';

describe('DalaliCalenderComponent', () => {
  let component: DalaliCalenderComponent;
  let fixture: ComponentFixture<DalaliCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DalaliCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DalaliCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
