import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSolidarityFund } from './admin-solidarity-fund';

describe('AdminSolidarityFund', () => {
  let component: AdminSolidarityFund;
  let fixture: ComponentFixture<AdminSolidarityFund>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSolidarityFund]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSolidarityFund);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
