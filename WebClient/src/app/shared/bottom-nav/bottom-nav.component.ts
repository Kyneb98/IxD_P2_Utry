import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

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
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css'] 
})
export class BottomNavComponent {
  navItems: NavItem[] = [
    { label: 'Size & fit', icon: 'straighten', route: '/size-fit' },
    { label: 'Compare', icon: 'compare_arrows', route: '/compare' },
    { label: 'Materials', icon: 'texture', route: '/materials' },
    { label: 'Style', icon: 'checkroom', route: '/style' }
  ];
}