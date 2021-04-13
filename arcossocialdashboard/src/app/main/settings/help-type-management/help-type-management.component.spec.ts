import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpTypeManagementComponent } from './help-type-management.component';

describe('HelpTypeManagementComponent', () => {
  let component: HelpTypeManagementComponent;
  let fixture: ComponentFixture<HelpTypeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpTypeManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
