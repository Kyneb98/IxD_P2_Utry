import { Component, OnInit, ViewChild } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CustomizeOneComponent } from "./customize-one/customize-one.component";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BodytypeFemaleComponent } from "./bodytype-female/bodytype-female.component";
import { MeasurementsComponent } from './measurements/measurements.component';
import { ActivatedRoute } from '@angular/router';
import { ZalandoTopBarComponent } from '../../home/zalando-top-bar/zalando-top-bar.component';

@Component({
  selector: 'app-onboarding',
  imports: [MatGridListModule, MatCardModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, CustomizeOneComponent,
    CommonModule, MatButtonModule, BodytypeFemaleComponent, MeasurementsComponent,
  ZalandoTopBarComponent],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})
export class OnboardingComponent implements OnInit {
  currentStep: number = 1; // Tracks the current step (1-based)
  totalSteps: number = 3; // Total number of steps in the onboarding process

  @ViewChild(CustomizeOneComponent) customizeOneComponent!: CustomizeOneComponent; // Reference to CustomizeOneComponent

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Sets the current step according to the 'step' parameter
    this.route.queryParams.subscribe(params => {
      const step = +params['step'];
      if (step >= 1 && step <= 3) {
        this.currentStep = step;
      }
    });
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.customizeOneComponent) {
      this.customizeOneComponent.onSubmit(); // Call the submitForm method of CustomizeOneComponent to save data
    }

    if(this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
