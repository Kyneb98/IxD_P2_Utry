import { Component } from '@angular/core';

import {MatSliderModule} from '@angular/material/slider';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserProfileMeasurements, ProfileMeasurementValue } from '../../services/measurement.model';
import { MeasurementService } from '../../services/measurement.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';


export interface SizeRule {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL'; // Define size options
  // Chest range in cm
  chestCmMin: number;
  chestCmMax: number;
  // Waist range in cm
  waistCmMin: number;
  waistCmMax: number;
}

export const TSHIRT_SIZE_CHART: SizeRule[] = [
  {size: 'XS', chestCmMin: 84, chestCmMax: 87, waistCmMin: 70, waistCmMax: 73},
  {size: 'S', chestCmMin: 88, chestCmMax: 95, waistCmMin: 74, waistCmMax: 82},
  {size: 'M', chestCmMin: 96, chestCmMax: 103, waistCmMin: 83, waistCmMax: 92},
  {size: 'L', chestCmMin: 104, chestCmMax: 107, waistCmMin: 93, waistCmMax: 97},
  {size: 'XL', chestCmMin: 108, chestCmMax: 111, waistCmMin: 98, waistCmMax: 101},
]


@Component({
  selector: 'app-size-and-fit-expansion-panel',
  imports: [
    MatSliderModule,
    MatTooltipModule,
    MatIcon,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './size-and-fit-expansion-panel.component.html',
  styleUrl: './size-and-fit-expansion-panel.component.css',
  animations: [
    trigger('panelState', [
      // State for when the panel is collapsed (only header/toggle visible)
      state('collapsed', style({
        transform: 'translateY(calc(100% - 40px))', // Adjust 40px based on header height
        // Opacity change is optional, depends on desired effect
         opacity: 1
      })),
      // State for when the panel is fully expanded
      state('expanded', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      // Smooth transition between states
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ])
  ]
})
export class SizeAndFitExpansionPanelComponent {
// Control the panel's state, start expanded by default
isExpanded: boolean = true;

// Toggle the expansion state
togglePanel(): void {
  this.isExpanded = !this.isExpanded;
}






isLoading = false;
  errorMessage: string | null = null;
  profileMeasurements: UserProfileMeasurements | null = null;
  currentUserId: number | null = null;
  recommendedSize: string | null = null;
  fitPreferenceCm: number = 0; // <-- Property for slider value (cm adjustment)
  private userIdSubscription: Subscription | null = null;
  private measurementSubscription: Subscription | null = null;

  constructor(
    private measurementService: MeasurementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
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
    this.recommendedSize = null;
    this.measurementSubscription?.unsubscribe();

    this.measurementSubscription = this.measurementService.getProfileMeasurements(userId)
      .pipe(finalize(() => this.isLoading = false ))
      .subscribe({
        next: (data) => {
          this.profileMeasurements = data;
          this.recalculateRecommendation(); // Call common method
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.profileMeasurements = null;
          this.recommendedSize = null;
        }
      });
  }

  /**
   * Recalculates the recommendation based on current measurements and fit preference.
   */
  recalculateRecommendation(): void {
     if (!this.profileMeasurements) {
         return;
     }
     console.log("Recalculating size recommendation with fit preference:", this.fitPreferenceCm);
     this.recommendedSize = this.recommendTShirtSize(this.profileMeasurements, this.fitPreferenceCm);
     console.log("New Recommended Size:", this.recommendedSize);
  }

  // --- Method triggered when the slider value changes via ngModelChange. ---
  onFitPreferenceChange(): void {
      this.recalculateRecommendation();
  }

  /**
   * Recommends a T-shirt size based on measurements and fit preference adjustment.
   * @param measurements The UserProfileMeasurements object.
   * @param fitPreferenceCm Adjustment in cm (-2, -1, 0, 1, 2 from slider).
   * @returns The recommended size string or null.
   */
  private recommendTShirtSize(measurements: UserProfileMeasurements | null, fitPreferenceCm: number): string | null {
    console.log('--- recommendTShirtSize START ---');
    if (!measurements) {
      console.log('recommendTShirtSize: Exiting - measurements object is null.');
      return null;
    }

    const chestMeasurement = measurements.chest;
    const waistMeasurement = measurements.waist;
    const originalChestValue = chestMeasurement?.value; // Get original values
    const originalWaistValue = waistMeasurement?.value;

    // --- Basic Validation ---
    if (originalChestValue === null || originalChestValue === undefined) {
      console.log("recommendTShirtSize:Original Chest value is missing.");
      return null; // Need at least chest
    }

    // --- Apply Fit Preference Adjustment to BOTH (if waist exists) ---
    const adjustedChestValue = originalChestValue + fitPreferenceCm;
    // Only adjust waist if it exists, otherwise keep it undefined/null for later checks
    const adjustedWaistValue = (originalWaistValue !== null && originalWaistValue !== undefined)
                                ? originalWaistValue + fitPreferenceCm
                                : originalWaistValue; // Keep as original (null/undefined) if original was so

    console.log(
        `recommendTShirtSize: Original Chest: ${originalChestValue} cm, Original Waist: ${originalWaistValue} cm, ` +
        `Pref Adjust: ${fitPreferenceCm} cm -> ` +
        `Adjusted Chest: ${adjustedChestValue} cm, Adjusted Waist: ${adjustedWaistValue} cm`
    );
    // --- End Adjustment ---


    // --- Iterate through the size chart using adjusted values ---
    console.log('recommendTShirtSize: Comparing against size chart:', TSHIRT_SIZE_CHART);
    for (const rule of TSHIRT_SIZE_CHART) {
      let chestMatch = false;
      let waistMatch = true; // Default to true (handles cases where waist isn't checked/available)

      // Log for current rule
      console.log(`  Checking Rule: ${rule.size} (Chest: ${rule.chestCmMin}-${rule.chestCmMax}, Waist: ${rule.waistCmMin}-${rule.waistCmMax})`);

      // Check primary measurement (Chest)
      if (adjustedChestValue >= rule.chestCmMin && adjustedChestValue <= rule.chestCmMax) {
        chestMatch = true;
        console.log(`    -> Adjusted Chest (${adjustedChestValue}) MATCHES Rule ${rule.size}`);
      }

      // Check adjusted secondary measurement (Waist)
      if (chestMatch && rule.waistCmMin !== undefined && rule.waistCmMax !== undefined) {
        if (adjustedWaistValue !== null && adjustedWaistValue !== undefined) {
            if (!(adjustedWaistValue >= rule.waistCmMin && adjustedWaistValue <= rule.waistCmMax)) {
                waistMatch = true; // Adjusted waist doesn't fit this rule
                console.log(`    -> Adjusted Waist (${adjustedWaistValue}) MATCHES Rule ${rule.size}`);
            }
        } else {
                console.log(`    -> Waist check SKIPPED for Rule ${rule.size} (user has no waist data).`);
        }
      }

      // If checks passed -> return size
      if (chestMatch && waistMatch) {
        console.log(`recommendTShirtSize: FINAL MATCH! Returning size ${rule.size}`);
        return rule.size;
      }
    } // End for loop

    // --- No Match Found ---
    console.log("recommendTShirtSize: No matching size found for the adjusted measurements.");
    return null;
  }

  private handleNoUserId(message = "Please log in to view measurements.") {
    this.errorMessage = message;
    this.profileMeasurements = null;
    this.recommendedSize = null; // Also clear recommendation
    this.isLoading = false;
  }
}
