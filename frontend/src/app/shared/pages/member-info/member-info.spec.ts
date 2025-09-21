import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberInfo } from './member-info';

describe('MemberInfo', () => {
  let component: MemberInfo;
  let fixture: ComponentFixture<MemberInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
