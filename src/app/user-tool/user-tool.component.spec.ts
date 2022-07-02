import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserToolComponent } from './user-tool.component';

describe('UserToolComponent', () => {
  let component: UserToolComponent;
  let fixture: ComponentFixture<UserToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
