import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';


interface SizeDescription {
  title: string;
  points: string[];
}

@Component({
  selector: 'app-compare-expansion-panel',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './compare-expansion-panel.component.html',
  styleUrl: './compare-expansion-panel.component.css',
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
export class CompareExpansionPanelComponent {


  // Control the panel's state, start expanded by default
isExpanded: boolean = true;

// Toggle the expansion state
togglePanel(): void {
  this.isExpanded = !this.isExpanded;
}


  // Use distinct ngModel variables
  selectedSizeLeft: string = 'S'; // Default for left select
  selectedDescriptionLeft: string = 'Regular fit'; // Default value matching mat-option

  selectedSizeRight: string = 'M'; // Default for right select
  selectedDescriptionRight: string = 'Slighty loose fit'; // Default value matching mat-option

  // Data structure for descriptions based on the *value* of mat-option
  sizeDescriptions: { [key: string]: SizeDescription } = {
    'Regular fit': { title: 'a regular fit', points: ['Fits nicely over the shoulders', 'Sleeves seem the correct length'] },
    'Slighty loose fit': { title: ' a looser fit', points: ['Fits oversize', 'Might be too long'] },
    'Loose fit': { title: 'an oversized fit', points: ['Significantly larger fit', 'Likely too long'] },
    'Very loose fit': { title: 'a very oversized fit', points: ['Very loose', 'Much too long'] }
    // Add more descriptions as needed
  };

  // Mapping for display value in select trigger
  sizeDisplayMap: { [key: string]: string } = {
    'Regular fit': 'S',
    'Slighty loose fit': 'M',
    'Loose fit': 'L',
    'Very loose fit': 'XL'
  };


  getDescription(selectedValue: string): SizeDescription | undefined {
    return this.sizeDescriptions[selectedValue];
  }

}
