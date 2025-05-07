import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface ProfileNavItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-profile-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './profile-bottom-nav-bar.component.html',
  styleUrls: ['./profile-bottom-nav-bar.component.css']
})
export class ProfileBottomNavBarComponent {
  // Default active section can be set to a profile-specific identifier
  @Input() activeSectionId: string = 'items';
  @Output() sectionSelected = new EventEmitter<string>();

  // Profile-specific navigation items
  navItems: ProfileNavItem[] = [
    { id: 'items', label: 'Items', icon: 'checkroom' },
    { id: 'outfits', label: 'Outfits', icon: 'styler' },
    { id: 'measurements', label: 'Measurements', icon: 'straighten' },
    { id: 'account', label: 'Account', icon: 'manage_accounts' }
  ];

  // Emits the selected section's ID
  selectSection(sectionId: string): void {
    this.sectionSelected.emit(sectionId);
  }
}
