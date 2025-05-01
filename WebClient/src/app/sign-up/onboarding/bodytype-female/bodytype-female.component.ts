import { Component } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-bodytype-female',
  imports: [MatRadioModule, CommonModule, FormsModule],
  templateUrl: './bodytype-female.component.html',
  styleUrl: './bodytype-female.component.css'
})
export class BodytypeFemaleComponent {

  bodyShapes = [
    { id: 'shape1', name: 'Slim', image: '/assets/body-shapes/slim.png' },
    { id: 'shape2', name: 'Athletic', image: '/assets/body-shapes/athletic.png' },
    { id: 'shape3', name: 'Curvy', image: '/assets/body-shapes/curvy.png' },
    { id: 'shape4', name: 'Plus Size', image: '/assets/body-shapes/plus-size.png' }
  ];
  selectedShape: string = ''; // Stores the selected body shape

  get selectedShapeName(): string | undefined {
    return this.bodyShapes.find(shape => shape.id === this.selectedShape)?.name;
  }
}

