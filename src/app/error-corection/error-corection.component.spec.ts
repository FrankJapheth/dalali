import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorCorectionComponent } from './error-corection.component';

describe('ErrorCorectionComponent', () => {
  let component: ErrorCorectionComponent;
  let fixture: ComponentFixture<ErrorCorectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorCorectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorCorectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
