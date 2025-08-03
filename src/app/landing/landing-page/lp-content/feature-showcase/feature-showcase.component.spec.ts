import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureShowcaseComponent } from './feature-showcase.component';

describe('FeatureShowcaseComponent', () => {
  let component: FeatureShowcaseComponent;
  let fixture: ComponentFixture<FeatureShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureShowcaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
