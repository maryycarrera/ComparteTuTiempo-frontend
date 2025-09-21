import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseIconButton } from './base-icon-button';

describe('BaseIconButton', () => {
  let component: BaseIconButton;
  let fixture: ComponentFixture<BaseIconButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseIconButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseIconButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
