import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareExpansionPanelComponent } from './compare-expansion-panel.component';

describe('CompareExpansionPanelComponent', () => {
  let component: CompareExpansionPanelComponent;
  let fixture: ComponentFixture<CompareExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareExpansionPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
