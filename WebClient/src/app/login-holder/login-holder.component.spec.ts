import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginHolderComponent } from './login-holder.component';

describe('LoginHolderComponent', () => {
  let component: LoginHolderComponent;
  let fixture: ComponentFixture<LoginHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginHolderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
