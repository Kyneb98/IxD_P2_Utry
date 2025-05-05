import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-gallery',
  imports: [CommonModule, MatIconModule],
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent {
  // Input property to set the gap/space between pictures (default is '10px')
  @Input() spacing: string = '10px';

  // Current starting index for the visible images.
  currentIndex: number = 0;

  // Array of image URLs; replace these with your actual image sources.
  images: string[] = [
    'black-tshirt.jpg',
    'blue-tshirt.jpg',
    'black-tshirt.jpg',
    'https://via.placeholder.com/300x200?text=Image+5',
    'https://via.placeholder.com/300x200?text=Image+6'
  ];

  // Holds the URL of the image currently expanded.
  expandedImage: string | null = null;

  // Computes the three images currently visible.
  get visibleImages(): string[] {
    return this.images.slice(this.currentIndex, this.currentIndex + 3);
  }

  // Show one previous image, so that 2 remain visible from the prior set.
  scrollUp(): void {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
  }

  // Show one new image along with the previous 2 images.
  scrollDown(): void {
    if (this.currentIndex + 3 < this.images.length) {
      this.currentIndex += 1;
    }
  }

  // Called when an image is clicked; sets the expandedImage property.
  expandImage(img: string): void {
    this.expandedImage = img;
  }

  // Called to close the expanded image overlay.
  closeImage(): void {
    this.expandedImage = null;
  }
}
