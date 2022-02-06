import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BunnerComponent } from './bunner.component';

describe('BunnerComponent', () => {
  let component: BunnerComponent;
  let fixture: ComponentFixture<BunnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BunnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
