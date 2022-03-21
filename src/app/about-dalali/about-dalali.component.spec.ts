import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutDalaliComponent } from './about-dalali.component';

describe('AboutDalaliComponent', () => {
  let component: AboutDalaliComponent;
  let fixture: ComponentFixture<AboutDalaliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutDalaliComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDalaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
