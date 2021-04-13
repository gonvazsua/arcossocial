import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtsManagementComponent } from './uts-management.component';

describe('UtsManagementComponent', () => {
  let component: UtsManagementComponent;
  let fixture: ComponentFixture<UtsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtsManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UtsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
