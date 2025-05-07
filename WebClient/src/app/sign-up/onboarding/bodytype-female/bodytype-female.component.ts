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
    { id: 'shape1', name: 'Oval', image: '/bodyTypes/MandOval.png' },
    { id: 'shape2', name: 'Rectangle', image: '/bodyTypes/MandRektangel.png' },
    { id: 'shape3', name: 'Triangle', image: '/bodyTypes/MandTrekant.png' },
    { id: 'shape4', name: 'Diamond', image: '/bodyTypes/MandDiamant.png' },
    { id: 'shape5', name: 'Trapezoid', image: '/bodyTypes/MandTrapez.png' },
    { id: 'shape6', name: 'Inverted triangle', image: '/bodyTypes/MandReversedTrekant.png' },
  ];
  selectedShape: string = ''; // Stores the selected body shape

  get selectedShapeName(): string | undefined {
    return this.bodyShapes.find(shape => shape.id === this.selectedShape)?.name;
  }
}

