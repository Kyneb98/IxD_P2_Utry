import { Component } from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';



// Define possible stretch levels
export type StretchLevel = 'Non' | 'Slight' | 'Medium' | 'High';

@Component({
  selector: 'app-material-expansion-panel',
  imports: [MatSliderModule,
    MatTooltipModule,
    MatIcon,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './material-expansion-panel.component.html',
  styleUrl: './material-expansion-panel.component.css',
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
export class MaterialExpansionPanelComponent {
  // Control the panel's state, start expanded by default
isExpanded: boolean = true;

// Toggle the expansion state
togglePanel(): void {
  this.isExpanded = !this.isExpanded;
}


itemStretchLevel: StretchLevel = 'Non';
// Static stretch level for this item example
}
