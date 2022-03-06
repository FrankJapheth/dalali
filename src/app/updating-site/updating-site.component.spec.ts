import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatingSiteComponent } from './updating-site.component';

describe('UpdatingSiteComponent', () => {
  let component: UpdatingSiteComponent;
  let fixture: ComponentFixture<UpdatingSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatingSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatingSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
