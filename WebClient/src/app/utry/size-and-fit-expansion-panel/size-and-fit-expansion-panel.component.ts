import { Component } from '@angular/core';

import {MatSliderModule} from '@angular/material/slider';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';




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
 

  
}
