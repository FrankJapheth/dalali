import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleWayFeedbackLoopComponent } from './single-way-feedback-loop.component';

describe('SingleWayFeedbackLoopComponent', () => {
  let component: SingleWayFeedbackLoopComponent;
  let fixture: ComponentFixture<SingleWayFeedbackLoopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleWayFeedbackLoopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleWayFeedbackLoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
