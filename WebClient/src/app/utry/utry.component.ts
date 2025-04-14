import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {BottomNavBarComponent} from './bottom-nav-bar/bottom-nav-bar.component';

@Component({
  selector: 'app-utry',
  imports: [MatButton,
    MatIcon,BottomNavBarComponent],
  templateUrl: './utry.component.html',
  styleUrl: './utry.component.css'
})
export class UtryComponent {

}
