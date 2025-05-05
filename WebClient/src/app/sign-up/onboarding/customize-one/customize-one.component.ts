import { Component, input } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable, of, Subscription } from 'rxjs'; // Import forkJoin for parallel requests
import { catchError, map, finalize } from 'rxjs/operators'; // Import operators
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MeasurementService } from '../../../services/measurement.service';
import { AddMeasurementResponse, MeasurementInputData, FailedSaveResult, MeasurementSaveAttemptResult } from '../../../services/measurement.model'; // Import model
import { AuthService } from '../../../services/auth.service'; // Import AuthService for authentication

@Component({
  selector: 'app-customize-one',
  imports: [ MatGridListModule, MatCardModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, MatChipsModule, CommonModule,
  ReactiveFormsModule],
  templateUrl: './customize-one.component.html',
  styleUrl: './customize-one.component.css'
})
export class CustomizeOneComponent {



  colorSet: string[] = [
    '#f5c6a5', // Light skin tone
    '#e0ac69', // Medium-light skin tone
    '#c68642', // Medium skin tone
    '#8d5524', // Medium-dark skin tone
    '#5a3825', // Dark skin tone
    '#3b2c20'  // Deep skin tone
  ];
  selectedColor: string = ''; // Stores the selected color

  measurementForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUserId: number | null = null;
  private userIdSubscription: Subscription | null = null; // Subscription to userId observable


  constructor(
    private fb: FormBuilder,
    private measurementService: MeasurementService,
    private authService: AuthService // Inject AuthService for authentication
  ) {

    // Initialize form with controls for both measurements
    this.measurementForm = this.fb.group({
      // Use different control names
      weightValue: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]*)?$/)]],
      weightUnit: ['kg'], // Default unit or empty
      heightValue: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]*)?$/)]],
      heightUnit: ['cm'] // Default unit or empty
    });
  }

  ngOnInit(): void {
    console.log('Component ngOnInit: Subscribing to AuthService for userId.');
    // --- Subscribe to the AuthService to get the userId reactively ---
    this.userIdSubscription = this.authService.currentUserId$.subscribe(userId => {
      console.log(`AuthService emitted userId: ${userId}`);
      this.currentUserId = userId; // Update the component's property

      // Handle state based on whether we have a user ID
      if (this.currentUserId === null) {
        // No user logged in (or logged out)
        this.handleNoUserId(); // Display error, disable form
      } else {
        // User ID is available
        this.errorMessage = null; // Clear any previous "no user" error
        if (this.measurementForm?.disabled) {
          this.measurementForm.enable(); // Ensure form is enabled
        }
      }
    });
    // --- End Subscription ---
  }

  ngOnDestroy(): void {
    // --- IMPORTANT: Unsubscribe to prevent memory leaks ---
    this.userIdSubscription?.unsubscribe();
    console.log('Component ngOnDestroy: Unsubscribed from userId.');
  }

  /** Handles the scenario where no valid user ID is available */
  private handleNoUserId(message = "User not identified. Please sign up or log in.") {
    this.errorMessage = message;
    // Disable form only if it exists and isn't already disabled
    if (this.measurementForm && !this.measurementForm.disabled) {
         this.measurementForm.disable();
    }
  }

  /** Convenience getters for form controls */
  get weightValueControl(): AbstractControl | null { return this.measurementForm.get('weightValue'); }
  get heightValueControl(): AbstractControl | null { return this.measurementForm.get('heightValue'); }

  /** Triggered on form submission */
  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.measurementForm.markAllAsTouched();

    // --- Use the userId obtained from the AuthService subscription ---
    if (!this.currentUserId) {
      this.errorMessage = "Cannot save measurements: User not identified.";
      console.error("Submit aborted: No currentUserId available from AuthService.");
      return;
    }
    // --- End userId Check ---

    if (this.measurementForm.invalid) {
      this.errorMessage = "Please fill in all required fields correctly.";
      return;
    }

    this.isLoading = true;
    const formData = this.measurementForm.value;

    // --- Prepare Data for both measurements ---
    const weightData: MeasurementInputData = {
      measurementType: 'Weight',
      value: parseFloat(formData.weightValue),
      unit: 'kg'
    };
    const heightData: MeasurementInputData = {
      measurementType: 'Height',
      value: parseFloat(formData.heightValue),
      unit: 'cm'
    };

    // --- Create Observables using this.currentUserId ---
    const saveWeight$ = this.measurementService.addMeasurement(weightData, this.currentUserId).pipe( // <-- Use component property
      catchError(error => of({ error: true as const, type: 'Weight', message: error.message }))
    );
    const saveHeight$ = this.measurementService.addMeasurement(heightData, this.currentUserId).pipe( // <-- Use component property
      catchError(error => of({ error: true as const, type: 'Height', message: error.message }))
    );

    // --- Execute calls using forkJoin ---
    forkJoin([saveWeight$, saveHeight$])
      .pipe(
        finalize(() => this.isLoading = false) // Reset loading state
      )
      .subscribe({
        next: (results: MeasurementSaveAttemptResult[]) => { // <-- Use imported type

          const failedSaves = results.filter(
              (res): res is FailedSaveResult => 'error' in res && res.error === true // <-- Use imported type in guard
          );
          const successfulSaves = results.filter(
              (res): res is AddMeasurementResponse => !('error' in res) // <-- Use imported type in guard
          );

           if (failedSaves.length === 0) {
              this.successMessage = `Successfully saved ${successfulSaves.length} measurement(s).`;
              this.measurementForm.reset(/* { defaults if needed } */);
           } else {
              const errorDetails = failedSaves.map(f => `${f.type}: ${f.message}`).join('; ');
              if (successfulSaves.length > 0) {
                 this.errorMessage = `Saved ${successfulSaves.length}, but failed for: ${errorDetails}`;
              } else {
                 this.errorMessage = `Failed to save measurements. Errors: ${errorDetails}`;
              }
           }
        },
        error: (err) => { // Catch unexpected forkJoin errors
            console.error("Unexpected error during forkJoin:", err);
            this.errorMessage = `An unexpected error occurred while saving: ${err.message || 'Unknown error'}`;
        }
      });
  }
}
