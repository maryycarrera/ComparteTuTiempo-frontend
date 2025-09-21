import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberNavbar } from './member-navbar';

describe('MemberNavbar', () => {
  let component: MemberNavbar;
  let fixture: ComponentFixture<MemberNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
