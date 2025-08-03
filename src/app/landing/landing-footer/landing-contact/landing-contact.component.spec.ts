import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingContactComponent } from './landing-contact.component';

describe('LandingContactComponent', () => {
  let component: LandingContactComponent;
  let fixture: ComponentFixture<LandingContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
