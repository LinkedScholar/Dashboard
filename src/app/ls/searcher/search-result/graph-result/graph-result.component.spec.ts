import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphResultComponent } from './graph-result.component';

describe('GraphResultComponent', () => {
  let component: GraphResultComponent;
  let fixture: ComponentFixture<GraphResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
