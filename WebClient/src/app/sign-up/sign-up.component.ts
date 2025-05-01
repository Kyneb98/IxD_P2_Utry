import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';

@Component({
  selector: 'app-sign-up',
  imports: [MatGridListModule, SignUpFormComponent, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  currentStep = 0; // Start at step 0

  incrementStep() {
    this.currentStep++;
  }

  decrementStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
}
