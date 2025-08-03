import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPrivacyComponent } from './landing-privacy.component';

describe('LandingPrivacyComponent', () => {
  let component: LandingPrivacyComponent;
  let fixture: ComponentFixture<LandingPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPrivacyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
