import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';




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


selected1: string = 'Choose size to compare';
selected2: string = 'Choose size to compare';
}
