import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOdersComponent } from './user-oders.component';

describe('UserOdersComponent', () => {
  let component: UserOdersComponent;
  let fixture: ComponentFixture<UserOdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
