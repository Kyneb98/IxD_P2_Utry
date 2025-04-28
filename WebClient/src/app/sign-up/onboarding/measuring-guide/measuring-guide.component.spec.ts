import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasuringGuideComponent } from './measuring-guide.component';

describe('MeasuringGuideComponent', () => {
  let component: MeasuringGuideComponent;
  let fixture: ComponentFixture<MeasuringGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasuringGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasuringGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
