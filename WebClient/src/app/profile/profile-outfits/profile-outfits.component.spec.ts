import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOutfitsComponent } from './profile-outfits.component';

describe('ProfileOutfitsComponent', () => {
  let component: ProfileOutfitsComponent;
  let fixture: ComponentFixture<ProfileOutfitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileOutfitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileOutfitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
