import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-outfits',
  templateUrl: './profile-outfits.component.html',
  styleUrls: ['./profile-outfits.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
})
export class ProfileOutfitsComponent implements OnInit {
  // Initial image paths.
  images: string[] = [
  '/wardrobeItems/cargoHoodie.png',
  '/wardrobeItems/denimhoodie.png',
  '/wardrobeItems/cargoPants(2).png',
  '/wardrobeItems/blackHoodie.png',
  '/wardrobeItems/blackCardigan.png',
];
  

  // New properties for search functionality.
  searchTerm: string = '';
  filteredImages: string[] = [];

  ngOnInit(): void {
    // Initially display all images.
    this.filterImages();
  }

  // Triggered when the search term changes.
  onSearchChange(): void {
    this.filterImages();
  }

  // Update filteredImages based on the search term.
  filterImages(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase().trim();
    if (!lowerCaseSearchTerm) {
      // If search term is empty, show all images.
      this.filteredImages = [...this.images];
    } else {
      // Filter images based on whether the filename includes the search term.
      this.filteredImages = this.images.filter((image) =>
        image.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
  }
}
