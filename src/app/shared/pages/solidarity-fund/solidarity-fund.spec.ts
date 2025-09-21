import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolidarityFund } from './solidarity-fund';

describe('SolidarityFund', () => {
  let component: SolidarityFund;
  let fixture: ComponentFixture<SolidarityFund>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolidarityFund]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolidarityFund);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
