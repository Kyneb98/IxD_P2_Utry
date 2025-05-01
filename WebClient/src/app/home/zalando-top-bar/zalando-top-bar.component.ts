import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-zalando-top-bar',
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './zalando-top-bar.component.html',
  styleUrl: './zalando-top-bar.component.css'
})
export class ZalandoTopBarComponent {

}
