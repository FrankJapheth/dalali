import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DLoaderComponent } from './d-loader.component';

describe('DLoaderComponent', () => {
  let component: DLoaderComponent;
  let fixture: ComponentFixture<DLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
