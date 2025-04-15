import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion'; // For accordions
import { MatTooltipModule } from '@angular/material/tooltip'; // For tooltips like the info icon

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    // Material Modules
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatExpansionModule, // <-- Import
    MatTooltipModule,   // <-- Import
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
}