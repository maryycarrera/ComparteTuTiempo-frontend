import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseUserForm } from './base-user-form';

describe('BaseUserForm', () => {
  let component: BaseUserForm;
  let fixture: ComponentFixture<BaseUserForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseUserForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseUserForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
