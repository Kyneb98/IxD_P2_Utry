import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBottomNavBarComponent } from './profile-bottom-nav-bar.component';

describe('ProfileBottomNavBarComponent', () => {
  let component: ProfileBottomNavBarComponent;
  let fixture: ComponentFixture<ProfileBottomNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileBottomNavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileBottomNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
