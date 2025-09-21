import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesContainer } from './messages-container';

describe('MessagesContainer', () => {
  let component: MessagesContainer;
  let fixture: ComponentFixture<MessagesContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
