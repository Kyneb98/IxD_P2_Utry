import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeAndFitExpansionPanelComponent } from './size-and-fit-expansion-panel.component';

describe('SizeAndFitExpansionPanelComponent', () => {
  let component: SizeAndFitExpansionPanelComponent;
  let fixture: ComponentFixture<SizeAndFitExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeAndFitExpansionPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SizeAndFitExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
