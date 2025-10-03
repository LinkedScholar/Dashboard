import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopExperienceRequiredComponent } from './desktop-experience-required.component';

describe('DesktopExperienceRequiredComponent', () => {
  let component: DesktopExperienceRequiredComponent;
  let fixture: ComponentFixture<DesktopExperienceRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopExperienceRequiredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopExperienceRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
