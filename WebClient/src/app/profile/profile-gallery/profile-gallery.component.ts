import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile-gallery',
  templateUrl: './profile-gallery.component.html',
  styleUrls: ['./profile-gallery.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
})
export class ProfileGalleryComponent implements OnInit {
  // Initial image paths.
  images: string[] = [
  '/wardrobeItems/cardiganBeige.jpg',
  '/wardrobeItems/denimPants.jpg',
  '/wardrobeItems/greyHoodie.jpg',
  '/wardrobeItems/whiteSneakers.png',
  '/wardrobeItems/denimJacket.jpg',
  '/wardrobeItems/cargoPants.jpg',
  '/wardrobeItems/beanieHat.jpg',
  '/wardrobeItems/scarf.jpg',
  '/wardrobeItems/whiteSneakers.png',
  '/wardrobeItems/denimJacket.jpg',
  '/wardrobeItems/cargoPants.jpg',
  '/wardrobeItems/beanieHat.jpg',
  '/wardrobeItems/scarf.jpg',
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
