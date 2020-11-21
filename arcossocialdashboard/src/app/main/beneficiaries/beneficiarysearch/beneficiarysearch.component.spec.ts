import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiarysearchComponent } from './beneficiarysearch.component';

describe('BeneficiarysearchComponent', () => {
  let component: BeneficiarysearchComponent;
  let fixture: ComponentFixture<BeneficiarysearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiarysearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiarysearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
