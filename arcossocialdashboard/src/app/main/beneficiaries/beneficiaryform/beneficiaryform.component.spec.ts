import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryformComponent } from './beneficiaryform.component';

describe('BeneficiaryformComponent', () => {
  let component: BeneficiaryformComponent;
  let fixture: ComponentFixture<BeneficiaryformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
