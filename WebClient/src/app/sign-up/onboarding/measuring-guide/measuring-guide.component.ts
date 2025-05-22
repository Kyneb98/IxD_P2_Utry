import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MeasurementService } from '../../../services/measurement.service';
import { AbstractControl } from '@angular/forms'; // Import AbstractControl for form control access
import { MeasurementInputData, AddMeasurementResponse } from '../../../services/measurement.model'; // Import your model
import { AuthService } from '../../../services/auth.service'; // Import AuthService for authentication
import { finalize, catchError } from 'rxjs/operators'; // Import finalize operator
import { Subscription } from 'rxjs';
import { ZalandoTopBarComponent } from "../../../home/zalando-top-bar/zalando-top-bar.component";
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-measuring-guide',
  imports: [MatGridListModule, MatCardModule, CommonModule, MatButtonModule, MatFormFieldModule,
    MatInput, ReactiveFormsModule, ZalandoTopBarComponent],
  templateUrl: './measuring-guide.component.html',
  styleUrl: './measuring-guide.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MeasuringGuideComponent {
  measurementForm: FormGroup; // Single form for the input field
  currentStep = 1; // Tracks the current step (1-based)
  totalSteps = 5; // Total number of measurement steps
  isLoading = false; // Tracks API call progress
  errorMessage: string | null = null; // Stores error messages for display
  successMessage: string | null = null; // Stores success messages for display
  currentUserId: number | null = null; // Stores the logged-in user's ID
  private userIdSubscription: Subscription | null = null; // To hold the AuthService subscription

  constructor(
    private fb: FormBuilder, // Inject FormBuilder
    private measurementService: MeasurementService, // Inject your service
    private authService: AuthService, // Inject AuthService to get user ID
    private router: Router // Inject Router for navigation
  ) {
    // Initialize the form group for the *shared* input field
    this.measurementForm = this.fb.group({
      // Control for the value input shown in each step
      value: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]*)?$/)]],

    });
  }

  ngOnInit(): void {
    // Subscribe to AuthService to get the user ID
    this.userIdSubscription = this.authService.currentUserId$.subscribe(userId => {
      this.currentUserId = userId;
      if (!this.currentUserId) {
        this.handleNoUserId();
      } else {
        // If form was disabled, re-enable it when user ID is available
        if (this.measurementForm?.disabled) {
             this.measurementForm.enable();
        }
         this.errorMessage = null; // Clear any previous error
      }
    });
  }

  ngOnDestroy(): void {

    this.userIdSubscription?.unsubscribe();
  }

  /** Handles the scenario where a valid userId cannot be obtained */
  private handleNoUserId(message = "User not identified. Please log in.") {
    this.errorMessage = message;
    if (this.measurementForm && !this.measurementForm.disabled) {
         this.measurementForm.disable();
    }
  }

  // --- Convenience Getter ---
  get valueControl(): AbstractControl | null { return this.measurementForm.get('value'); }

  /**
   * Determines the measurement type and unit based on the current step.
   * @returns An object containing { type: string, unit: string } or null if step is invalid.
   */
  private getMeasurementDetailsForStep(step: number): { type: string; unit: string } | null {
    switch (step) {
      case 1: return { type: 'Waist', unit: 'cm' };
      case 2: return { type: 'Chest', unit: 'cm' };
      case 3: return { type: 'Arms', unit: 'cm' };
      case 4: return { type: 'Shoulders', unit: 'cm' };
      case 5: return { type: 'Front Bodice', unit: 'cm' };
      default: return null; // Invalid step
    }
  }

  /**
   * Triggered when the user attempts to save the current step's measurement
   */
  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.measurementForm.markAllAsTouched();

    if (!this.currentUserId) {
      this.errorMessage = "Cannot save measurement: User not identified.";
      return;
    }
    if (this.measurementForm.invalid) {
      this.errorMessage = "Please enter a valid measurement value.";
      return;
    }

    const stepDetails = this.getMeasurementDetailsForStep(this.currentStep);
    if (!stepDetails) {
      this.errorMessage = `Internal error: Invalid step number (${this.currentStep}).`;
      return;
    }

    this.isLoading = true;
    const formData = this.measurementForm.value;
    const measurementData: MeasurementInputData = {
      measurementType: stepDetails.type,
      value: parseFloat(formData.value),
      unit: stepDetails.unit
    };

    console.log(`Attempting to save: Step ${this.currentStep}, Type: ${measurementData.measurementType}, User: ${this.currentUserId}`);

    this.measurementService.addMeasurement(measurementData, this.currentUserId)
      .pipe(
        finalize(() => this.isLoading = false) // Reset loading state regardless of outcome
      )
      .subscribe({
        next: (response: AddMeasurementResponse) => {
          console.log(`Step ${this.currentStep} (${measurementData.measurementType}) saved successfully:`, response);

          this.valueControl?.reset(); // Clear input field

          // --- TRIGGER NEXT STEP LOGIC ON SUCCESS ---
          if (this.currentStep < this.totalSteps) {
            // Call nextStep function
            this.goToNextStep();
          } else {
            // This was the *last* step (Finish button)
            console.log("All measurements finished.");
            this.successMessage = "All measurements saved successfully!";
            this.measurementForm.disable(); // Diable form after last step
            // Handle final completion (e.g., navigate to dashboard)
            // this.router.navigate(['/dashboard']);
            this.router.navigate(['/onboarding/step/3'])
          }
          // --- END TRIGGER ---

        },
        error: (error: Error) => {
          console.error(`Error saving Step ${this.currentStep} (${measurementData.measurementType}):`, error);
          this.errorMessage = `Error saving ${measurementData.measurementType}: ${error.message}`;

        }
      });
  } // End onSubmit

  /**
   * Advances the step number and updates the UI.
   * This is called internally AFTER a successful save.
   */
  private goToNextStep(): void {
     if (this.currentStep < this.totalSteps) {
         this.currentStep++;
         console.log(`Moved to step ${this.currentStep}`);
         // Reset messages for the new step
         this.successMessage = null; // Clear success from previous step
         this.errorMessage = null;

     }
  }


  /** Moves to the previous step */
  prevStep(): void {
    if (this.currentStep > 1) {
      this.isLoading = false; // Ensure loading is stopped
      this.currentStep--;
      this.valueControl?.reset();
      this.errorMessage = null;
      this.successMessage = null;
      if (this.measurementForm?.disabled) {
        this.measurementForm.enable();
      }
    }
  }
}
