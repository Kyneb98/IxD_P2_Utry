import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZalandoTopBarComponent } from './zalando-top-bar.component';

describe('ZalandoTopBarComponent', () => {
  let component: ZalandoTopBarComponent;
  let fixture: ComponentFixture<ZalandoTopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZalandoTopBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZalandoTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
