import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrettybooleanComponent } from './prettyboolean.component';

describe('PrettybooleanComponent', () => {
  let component: PrettybooleanComponent;
  let fixture: ComponentFixture<PrettybooleanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrettybooleanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrettybooleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
