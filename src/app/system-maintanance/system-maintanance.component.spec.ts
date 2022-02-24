import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMaintananceComponent } from './system-maintanance.component';

describe('SystemMaintananceComponent', () => {
  let component: SystemMaintananceComponent;
  let fixture: ComponentFixture<SystemMaintananceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemMaintananceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemMaintananceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
