import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewhelpComponent } from './newhelp.component';

describe('NewhelpComponent', () => {
  let component: NewhelpComponent;
  let fixture: ComponentFixture<NewhelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewhelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewhelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
