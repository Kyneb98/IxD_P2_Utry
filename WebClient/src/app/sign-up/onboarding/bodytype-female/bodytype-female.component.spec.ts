import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodytypeFemaleComponent } from './bodytype-female.component';

describe('BodytypeFemaleComponent', () => {
  let component: BodytypeFemaleComponent;
  let fixture: ComponentFixture<BodytypeFemaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodytypeFemaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodytypeFemaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
