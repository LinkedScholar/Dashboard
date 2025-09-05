import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlaceHolderComponent } from './user-place-holder.component';

describe('UserPlaceHolderComponent', () => {
  let component: UserPlaceHolderComponent;
  let fixture: ComponentFixture<UserPlaceHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPlaceHolderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPlaceHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
