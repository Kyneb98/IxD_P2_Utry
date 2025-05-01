import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable, of } from 'rxjs'; // Import forkJoin for parallel requests
import { catchError, map } from 'rxjs/operators'; // Import operators
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MeasurementService } from '../../../services/measurement.service';
import { AddMeasurementResponse, MeasurementInputData } from '../../../services/measurement.model'; // Import your model



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

  // --- PLACEHOLDER for authenticated user ID (Get from localStorage) ---
  currentUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private measurementService: MeasurementService
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
    // Retrieve user ID from localStorage
    try {
      const storedUserId = localStorage.getItem('currentUserId');
      if (storedUserId) {
        this.currentUserId = parseInt(storedUserId, 10);
      } else {
        this.handleNoUserId();
      }
    } catch (e) {
      console.error("Error reading userId from localStorage", e);
      this.handleNoUserId("Could not read user session. Please ensure localStorage is enabled.");
    }
  }

  private handleNoUserId(message = "User not identified. Please sign up or log in.") {
    console.warn("No userId available.");
    this.errorMessage = message;
    this.measurementForm.disable();
  }

  // --- Getters for easier template access ---
  get weightValueControl(): AbstractControl | null { return this.measurementForm.get('weightValue'); }
  get weightUnitControl(): AbstractControl | null { return this.measurementForm.get('weightUnit'); }
  get heightValueControl(): AbstractControl | null { return this.measurementForm.get('heightValue'); }
  get heightUnitControl(): AbstractControl | null { return this.measurementForm.get('heightUnit'); }
  // --- End Getters ---

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.measurementForm.markAllAsTouched();

    if (!this.currentUserId) {
      this.errorMessage = "Cannot save measurements: User not identified.";
      return;
    }

    if (this.measurementForm.invalid) {
      this.errorMessage = "Please fill in all required fields correctly.";
      return;
    }

    this.isLoading = true;
    const formData = this.measurementForm.value;

    // --- Prepare data objects for each measurement ---
    const weightData: MeasurementInputData = {
      measurementType: 'Weight', // Consider making this configurable if needed
      value: parseFloat(formData.weightValue),
      unit: formData.weightUnit || undefined
    };

    const heightData: MeasurementInputData = {
      measurementType: 'Height', // Consider making this configurable
      value: parseFloat(formData.heightValue),
      unit: formData.heightUnit || undefined
    };

    // --- Create an array of Observables for the API calls ---
    const saveObservables: Observable<AddMeasurementResponse | { error: true, message: string, type: string }>[] = [];

    // Add weight observable if value is present (or always if required)
    if (weightData.value) { // Or remove check if always required
        saveObservables.push(
            this.measurementService.addMeasurement(weightData, this.currentUserId)
                .pipe(
                    // Use catchError within each observable to handle individual errors
                    catchError(err => of({ error: true as const, message: err.message, type: 'Weight' }))
                )
        );
    }
     // Add height observable if value is present (or always if required)
    if (heightData.value) { // Or remove check if always required
        saveObservables.push(
            this.measurementService.addMeasurement(heightData, this.currentUserId)
                .pipe(
                    catchError(err => of({ error: true as const, message: err.message, type: 'Height' }))
                )
        );
    }

    if (saveObservables.length === 0) {
        this.errorMessage = "No measurement data entered.";
        this.isLoading = false;
        return;
    }

    // --- Use forkJoin to run calls in parallel and wait for all to complete ---
    forkJoin(saveObservables).subscribe({
      next: (results) => {
        this.isLoading = false;
        const successfulSaves = results.filter(res => !('error' in res));
        const failedSaves = results.filter((res): res is { error: true, message: string, type: string } => 'error' in res); // Type guard

        if (failedSaves.length === 0) {
          // All succeeded
          this.successMessage = `Successfully saved ${successfulSaves.length} measurement(s).`;
          this.measurementForm.reset({ weightUnit: 'kg', heightUnit: 'cm' }); // Reset form, maybe keep units
        } else if (successfulSaves.length > 0) {
          // Partial success
          const errorDetails = failedSaves.map(f => `${f.type}: ${f.message}`).join('; ');
          this.errorMessage = `Saved ${successfulSaves.length} measurement(s), but failed for: ${errorDetails}`;
           // Decide if you want to reset the form on partial success
           // this.measurementForm.reset({ weightUnit: 'kg', heightUnit: 'cm' });
        } else {
          // All failed
          const errorDetails = failedSaves.map(f => `${f.type}: ${f.message}`).join('; ');
          this.errorMessage = `Failed to save measurements. Errors: ${errorDetails}`;
        }
      },
      // Note: forkJoin's main error callback won't typically be hit here
      // because we used catchError inside each individual observable.
      // If any observable errors *before* catchError, it would trigger this.
      error: (err) => {
         this.isLoading = false;
         this.errorMessage = `An unexpected error occurred during batch save: ${err.message}`;
         console.error("Unexpected forkJoin error:", err);
      }
    });
  }

}
