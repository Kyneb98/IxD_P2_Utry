import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-measuring-guide',
  imports: [MatGridListModule, MatCardModule, CommonModule, MatButtonModule, MatFormFieldModule,
    MatInput, RouterLink],
  templateUrl: './measuring-guide.component.html',
  styleUrl: './measuring-guide.component.css'
})
export class MeasuringGuideComponent {
  currentStep: number = 1; // Start with step 1

  nextStep(): void {
    this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
