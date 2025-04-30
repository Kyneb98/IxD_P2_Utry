import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleExpansionPanelComponent } from './style-expansion-panel.component';

describe('StyleExpansionPanelComponent', () => {
  let component: StyleExpansionPanelComponent;
  let fixture: ComponentFixture<StyleExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StyleExpansionPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StyleExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
