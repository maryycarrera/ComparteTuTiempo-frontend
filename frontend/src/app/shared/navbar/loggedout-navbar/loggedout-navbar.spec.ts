import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedoutNavbar } from './loggedout-navbar';

describe('LoggedoutNavbar', () => {
  let component: LoggedoutNavbar;
  let fixture: ComponentFixture<LoggedoutNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggedoutNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggedoutNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
