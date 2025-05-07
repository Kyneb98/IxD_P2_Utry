import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-gallery',
  templateUrl: './profile-gallery.component.html',
  styleUrls: ['./profile-gallery.component.css'],
  imports: [CommonModule, MatCardModule],
})
export class ProfileGalleryComponent {
  // Replace these with your image paths. Here are six example images.
  images: string[] = [
    'orange-hoodie.jpg',
    'yellow-tshirt.jpeg',
    'black-tshirt.jpg',
    'blue-tshirt.jpg',
    'orange-hoodie.jpg',
    'yellow-tshirt.jpeg',
    'blue-tshirt.jpg',
    'orange-hoodie.jpg',
    'yellow-tshirt.jpeg',
    'black-tshirt.jpg',
    'blue-tshirt.jpg',
    'blue-tshirt.jpg',
    'orange-hoodie.jpg',
    'yellow-tshirt.jpeg',
  ];
}
