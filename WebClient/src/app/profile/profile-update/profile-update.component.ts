import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, finalize, forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { MeasurementService } from '../../services/measurement.service';
import { AuthService } from '../../services/auth.service';
import { UserProfileMeasurements } from '../../services/measurement.model';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-profile-update',
  imports: [CommonModule, MatButton, MatFormField, MatError, MatProgressBar,
    MatLabel, ReactiveFormsModule, MatInputModule],
  templateUrl: './profile-update.component.html',
  styleUrl: './profile-update.component.css'
})
export class ProfileUpdateComponent implements OnDestroy {

isLoading = false;
errorMessage: string | null = null;
successMessage: string | null = null;
profileMeasurements: UserProfileMeasurements | null = null;
currentUserId: number | null = null;
measurementKeys = ['weight', 'height', 'waist', 'chest', 'arms', 'shoulders', 'front_bodice'] as const;
private userIdSubscription: Subscription | null = null;
private measurementSubscription: Subscription | null = null;

measurementForm!: FormGroup;

constructor(
    private measurementService: MeasurementService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
      this.isLoading = true;
      this.measurementForm = this.fb.group({});
      this.userIdSubscription = this.authService.currentUserId$.subscribe(userId => {
        this.currentUserId = userId;
        if (this.currentUserId !== null) {
          this.fetchMeasurements(this.currentUserId);
        } else {
          this.handleNoUserId();
        }
      });
    }

    ngOnDestroy(): void {
  this.userIdSubscription?.unsubscribe();
  this.measurementSubscription?.unsubscribe();
}

  fetchMeasurements(userId: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.profileMeasurements = null;
    this.measurementSubscription?.unsubscribe();

    this.measurementSubscription = this.measurementService.getProfileMeasurements(userId)
      .pipe(finalize(() => this.isLoading = false ))
      .subscribe({
        next: (data) => {
          this.profileMeasurements = data;
          this.initForm(data);
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.profileMeasurements = null;
        }
      });
  }

  initForm(measurements: UserProfileMeasurements): void {
    const group: any = {};
    this.measurementKeys.forEach(key => {
      group[key] = [
        measurements[key]?.value ?? '', // Use the number or empty string if null
        [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]
      ];
    });
    this.measurementForm = this.fb.group(group);
  }

  saveAll(): void {
    if (!this.currentUserId || !this.profileMeasurements) return;
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const updateRequests = Object.entries(this.profileMeasurements)
    .filter(([_, val]) => val && val.id != null)
    .map(([key, val]) => {
      return this.measurementService.updateMeasurement(val.id, {
        value: parseFloat(this.measurementForm.get(key)?.value),
        unit: val!.unit,
        userId: this.currentUserId!
      });
    });

    if (updateRequests.length === 0) {
      this.isLoading = false;
      return;
    }

    forkJoin(updateRequests)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: () => { this.successMessage = "All measurements updated successfully!"; },
      error: (err) => {
        this.errorMessage = err.message;
        console.error('Error updating measurements:', err);
      }
    });
  }

  private handleNoUserId(message = "Please log in to view measurements.") {
    this.errorMessage = message;
    this.profileMeasurements = null;
    this.isLoading = false;
  }
}
