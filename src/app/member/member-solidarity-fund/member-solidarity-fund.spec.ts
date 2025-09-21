import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSolidarityFund } from './member-solidarity-fund';

describe('MemberSolidarityFund', () => {
  let component: MemberSolidarityFund;
  let fixture: ComponentFixture<MemberSolidarityFund>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberSolidarityFund]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberSolidarityFund);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
