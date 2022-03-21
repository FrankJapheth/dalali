import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivaceyPoliceyComponent } from './privacey-policey.component';

describe('PrivaceyPoliceyComponent', () => {
  let component: PrivaceyPoliceyComponent;
  let fixture: ComponentFixture<PrivaceyPoliceyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivaceyPoliceyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivaceyPoliceyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
