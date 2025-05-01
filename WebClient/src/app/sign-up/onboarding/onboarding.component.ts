import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-onboarding',
  imports: [MatGridListModule, MatCardModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, CustomizeOneComponent,
    CommonModule, MatButtonModule, BodytypeFemaleComponent, MeasurementsComponent,
  ],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})
export class OnboardingComponent implements OnInit {
  currentStep: number = 1; // Start with step 1

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
    this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
