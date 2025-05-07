import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProfileBottomNavBarComponent } from '../profile/profile-bottom-nav-bar/profile-bottom-nav-bar.component';
import { ZalandoTopBarComponent } from '../home/zalando-top-bar/zalando-top-bar.component';
import { ProfileGalleryComponent } from './profile-gallery/profile-gallery.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,
    ProfileBottomNavBarComponent,
    ZalandoTopBarComponent,
    ProfileGalleryComponent,
    // Material Modules
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule,],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfileComponent {

  
  // Now always visible – for profile, we default to the 'overview' section
  activeProfileSectionId: string = 'items';

  constructor(private cdRef: ChangeDetectorRef) {}

  // Handle event from the profile nav bar
  onProfileSectionSelected(sectionId: string): void {
    this.activeProfileSectionId = sectionId;
    // Update the view to reflect any changes
    this.cdRef.detectChanges();
  }
}





