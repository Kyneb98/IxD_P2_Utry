import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-customize-one',
  imports: [ MatGridListModule, MatCardModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, MatChipsModule, CommonModule],
  templateUrl: './customize-one.component.html',
  styleUrl: './customize-one.component.css'
})
export class CustomizeOneComponent {

  colorSet: string[] = [
    '#f5c6a5', // Light skin tone
    '#e0ac69', // Medium-light skin tone
    '#c68642', // Medium skin tone
    '#8d5524', // Medium-dark skin tone
    '#5a3825', // Dark skin tone
    '#3b2c20'  // Deep skin tone
  ];
  selectedColor: string = ''; // Stores the selected color

}
