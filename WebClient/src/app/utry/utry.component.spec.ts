import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtryComponent } from './utry.component';

describe('UtryComponent', () => {
  let component: UtryComponent;
  let fixture: ComponentFixture<UtryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
