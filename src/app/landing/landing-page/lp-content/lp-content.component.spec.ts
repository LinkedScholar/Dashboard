import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpContentComponent } from './lp-content.component';

describe('LpContentComponent', () => {
  let component: LpContentComponent;
  let fixture: ComponentFixture<LpContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LpContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
