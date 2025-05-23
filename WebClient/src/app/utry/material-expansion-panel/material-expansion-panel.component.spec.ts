import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialExpansionPanelComponent } from './material-expansion-panel.component';

describe('MaterialExpansionPanelComponent', () => {
  let component: MaterialExpansionPanelComponent;
  let fixture: ComponentFixture<MaterialExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialExpansionPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
