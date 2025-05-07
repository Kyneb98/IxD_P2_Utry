import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


// Interface for wardrobe items
interface WardrobeItem {
  id: number;
  name: string;
  img: string;
  selected: boolean;
}

@Component({
  selector: 'app-style-expansion-panel',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './style-expansion-panel.component.html',
  styleUrl: './style-expansion-panel.component.css',
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
export class StyleExpansionPanelComponent {

    // Control the panel's state, start expanded by default
isExpanded: boolean = true;

// Toggle the expansion state
togglePanel(): void {
  this.isExpanded = !this.isExpanded;
}



 // Dummy wardrobe item data (Add more for scrolling)
 wardrobeItems: WardrobeItem[] = [
  { id: 1, name: 'Cardigan', img: '/wardrobeItems/cardiganBeige.jpg', selected: false },
  { id: 2, name: 'Blue Jeans', img: '/wardrobeItems/denimPants.jpg', selected: false },
  { id: 3, name: 'Grey Hoodie', img: '/wardrobeItems/greyHoodie.jpg', selected: false },
  { id: 4, name: 'White Sneakers', img: '/wardrobeItems/whiteSneakers.png', selected: false },
  { id: 5, name: 'Denim Jacket', img: '/wardrobeItems/denimJacket.jpg', selected: false },
  { id: 6, name: 'Cargo Pants', img: '/wardrobeItems/cargoPants.jpg', selected: false },
  { id: 7, name: 'Beanie Hat', img: '/wardrobeItems/beanieHat.jpg', selected: false },
  { id: 8, name: 'Scarf', img: '/wardrobeItems/scarf.jpg', selected: false }, // Example extra item
];

// Method to handle selecting an item
selectItem(selectedItem: WardrobeItem): void {
  this.wardrobeItems.forEach(item => item.selected = false);
  selectedItem.selected = true;
  console.log('Selected wardrobe item:', selectedItem.name);
  // Add logic here if needed
}



}
