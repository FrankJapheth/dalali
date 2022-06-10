import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaysChangesComponent } from './days-changes.component';

describe('DaysChangesComponent', () => {
  let component: DaysChangesComponent;
  let fixture: ComponentFixture<DaysChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaysChangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaysChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
