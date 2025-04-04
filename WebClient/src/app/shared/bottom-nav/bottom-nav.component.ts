import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule for routerLink, routerLinkActive
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core'; // For ripple effect


interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Add RouterModule here
    MatIconModule,
    MatRippleModule
  ],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {
  navItems: NavItem[] = [
    { label: 'Size & fit', icon: 'straighten', route: '/size-fit' },
    { label: 'Compare', icon: 'safety_divider', route: '/compare' },
    { label: 'Materials', icon: 'texture', route: '/materials' }, // Or 'inventory_2'
    { label: 'Style', icon: 'checkroom', route: '/style' }       // Or 'style'
  ];
}