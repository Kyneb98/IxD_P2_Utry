import { Component } from '@angular/core';

import {MatSliderModule} from '@angular/material/slider';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';

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

// Placeholder for slider value if needed
fitValue: number = 50;

isLoading = false;
  errorMessage: string | null = null;
  profileMeasurements: UserProfileMeasurements | null = null;
  currentUserId: number | null = null;
  recommendedSize: string | null = null;
  private userIdSubscription: Subscription | null = null;
  private measurementSubscription: Subscription | null = null;

  constructor(
    private measurementService: MeasurementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    console.log('ngOnInit - Subscribing to userId');

    this.userIdSubscription = this.authService.currentUserId$.subscribe(userId => {
      console.log(`Received userId - ${userId}`);
      this.currentUserId = userId;
      if (this.currentUserId !== null) {
        this.fetchMeasurements(this.currentUserId);
      } else {
        this.handleNoUserId();
      }
    });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy - Unsubscribing');
    this.userIdSubscription?.unsubscribe();
    this.measurementSubscription?.unsubscribe();
  }

  fetchMeasurements(userId: number): void {
    console.log(`Fetching measurements for userId ${userId}`);
    this.isLoading = true;
    this.errorMessage = null;
    this.profileMeasurements = null;
    this.recommendedSize = null;

    this.measurementSubscription?.unsubscribe();

    this.measurementSubscription = this.measurementService.getProfileMeasurements(userId)
      .pipe(
        finalize(() => {
            console.log('Measurement fetch finalized.');
            this.isLoading = false;
         })
      )
      .subscribe({
        next: (data: UserProfileMeasurements) => {
          console.log("SizeAndFitExpansionPanelComponent: Received profile measurements:", data);
          this.profileMeasurements = data;
          // --- CALL RECOMMENDATION LOGIC ---
          this.recommendedSize = this.recommendTShirtSize(this.profileMeasurements);
          console.log("Recommended Size property is now:", this.recommendedSize);
          // --- END CALL ---
        },
        error: (err: Error) => {
          console.error("SizeAndFitExpansionPanelComponent: Error fetching profile measurements:", err);
          this.errorMessage = err.message;
          this.profileMeasurements = null;
          this.recommendedSize = null; // Clear recommendation on error
        }
      });
  }

  private recommendTShirtSize(measurements: UserProfileMeasurements | null): string | null {
    console.log('--- recommendTShirtSize START ---');
    if (!measurements) {
      console.log('recommendTShirtSize: Exiting - measurements object is null.');
      return null;
    }

    const chestMeasurement = measurements.chest;
    const waistMeasurement = measurements.waist;
    console.log('recommendTShirtSize: Chest Data:', JSON.stringify(chestMeasurement));
    console.log('recommendTShirtSize: Waist Data:', JSON.stringify(waistMeasurement));

    const chestValue = chestMeasurement?.value;
    const waistValue = waistMeasurement?.value;

    if (chestValue === null || chestValue === undefined) {
      console.log("recommendTShirtSize: Exiting - Chest value is missing.");
      return null;
    }

    console.log(`recommendTShirtSize: Using Chest: ${chestValue}, Waist: ${waistValue}`);
    console.log('recommendTShirtSize: Comparing against size chart:', TSHIRT_SIZE_CHART);

    for (const rule of TSHIRT_SIZE_CHART) {
      let chestMatch = false;
      let waistMatch = true;
      console.log(`recommendTShirtSize: Checking Rule: ${rule.size} (Chest: ${rule.chestCmMin}-${rule.chestCmMax}, Waist: ${rule.waistCmMin}-${rule.waistCmMax})`);

      if (chestValue >= rule.chestCmMin && chestValue <= rule.chestCmMax) {
        chestMatch = true;
        console.log(`-> Chest Matches Rule ${rule.size}`);
      } else {
         console.log(`-> Chest DOES NOT Match Rule ${rule.size}`);
      }

      if (chestMatch && rule.waistCmMin !== undefined && rule.waistCmMax !== undefined && waistValue !== null && waistValue !== undefined) {
         console.log(` -> Checking waist value ${waistValue} against rule ${rule.waistCmMin}-${rule.waistCmMax}`);
        if (!(waistValue >= rule.waistCmMin && waistValue <= rule.waistCmMax)) {
          waistMatch = false;
          console.log(` -> Waist DOES NOT Match Rule ${rule.size}`);
        } else {
            console.log(` -> Waist Matches Rule ${rule.size}`);
        }
      } else if (chestMatch && rule.waistCmMin !== undefined) {
           console.log(` -> Waist check skipped for Rule ${rule.size} (rule needs waist, but user data missing or not defined in rule)`);
      }

      if (chestMatch && waistMatch) {
        console.log(`recommendTShirtSize: FINAL MATCH! Returning size ${rule.size}`);
        console.log('--- recommendTShirtSize END (Match Found) ---');
        return rule.size;
      }
    }

    console.log("recommendTShirtSize: No matching size found after checking all rules.");
    console.log('--- recommendTShirtSize END (No Match) ---');
    return null;
  }

  private handleNoUserId(message = "Please log in to view measurements.") {
    this.errorMessage = message;
    this.profileMeasurements = null;
    this.recommendedSize = null; // Also clear recommendation
    this.isLoading = false;
  }
}
