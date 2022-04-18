import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiWaysFeedbackLoopComponent } from './multi-ways-feedback-loop.component';

describe('MultiWaysFeedbackLoopComponent', () => {
  let component: MultiWaysFeedbackLoopComponent;
  let fixture: ComponentFixture<MultiWaysFeedbackLoopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiWaysFeedbackLoopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiWaysFeedbackLoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
