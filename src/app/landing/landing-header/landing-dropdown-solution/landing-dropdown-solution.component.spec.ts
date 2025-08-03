import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingDropdownSolutionComponent } from './landing-dropdown-solution.component';

describe('LandingDropdownSolutionComponent', () => {
  let component: LandingDropdownSolutionComponent;
  let fixture: ComponentFixture<LandingDropdownSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingDropdownSolutionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingDropdownSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
