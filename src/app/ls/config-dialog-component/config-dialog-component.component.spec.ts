import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigDialogComponentComponent } from './config-dialog-component.component';

describe('ConfigDialogComponentComponent', () => {
  let component: ConfigDialogComponentComponent;
  let fixture: ComponentFixture<ConfigDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigDialogComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
