import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BottomNavBarComponent } from '../utry/bottom-nav-bar/bottom-nav-bar.component';
import { SizeAndFitExpansionPanelComponent } from '../utry/size-and-fit-expansion-panel/size-and-fit-expansion-panel.component';


import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BottomNavBarComponent,
    SizeAndFitExpansionPanelComponent,
    // Material Modules
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Static data for the page
  thumbnails = [
    '/zalandoHome/shirt1.png',
    '/zalandoHome/shirt2.png',
    '/zalandoHome/shirt3.png',
    '/zalandoHome/shirt4.png',
    '/zalandoHome/whiteT.png',
  ];

  colorSwatches = [
    { name: 'white', img: '/zalandoHome/whiteT.png', selected: true },
    { name: 'black', img: '/zalandoHome/blackT.png' },
    { name: 'navy', img: '/zalandoHome/blueT.jpg' },
    { name: 'brown', img: '/zalandoHome/greyT.jpg' },
    { name: 'lightgrey', img: '/zalandoHome/lightGreyT.jpg' },
  ];

  mainImageUrl = '/zalandoHome/startPic.png'; // Use the men's main image


  // State variable to control the visibility of the UTRY view
  showUtryView = false;
  // --- Variable for UTRY content section ---
  activeUtrySectionId: string = 'size-fit'; // Default section

  // Method to switch the view to UTRY
  activateUtryView(): void {
    this.showUtryView = true;
    this.activeUtrySectionId = 'size-fit';
  }

  // method to close UTRY view
  deactivateUtryView(): void {
    this.showUtryView = false;
  }

  // Method to handle event from nav bar
  onUtrySectionSelected(sectionId: string): void {
    this.activeUtrySectionId = sectionId;

  }
}
