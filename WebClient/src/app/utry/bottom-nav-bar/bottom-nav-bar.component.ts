import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SizeAndFitExpansionPanelComponent } from '../size-and-fit-expansion-panel/size-and-fit-expansion-panel.component';
import { ModelViewerComponent } from "../../model-viewer/model-viewer.component";


interface NavItem {
  id: string;
  label: string;
  icon: string;
} 

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    SizeAndFitExpansionPanelComponent,
    ModelViewerComponent
],
  templateUrl: './bottom-nav-bar.component.html',
  styleUrls: ['./bottom-nav-bar.component.css'] 
})
export class BottomNavBarComponent {
   // Track the currently active section, default to 'size-fit'
   activeSectionId: string = 'size-fit';

  navItems: NavItem[] = [
    { id: 'size-fit', label: 'Size & fit', icon: 'straighten' },
    { id: 'compare', label: 'Compare', icon: 'compare_arrows' },
    { id: 'materials', label: 'Materials', icon: 'texture' },
    { id: 'style', label: 'Style', icon: 'checkroom' }
  ];

  // Method to change the active section
  setActiveSection(sectionId: string): void {
    this.activeSectionId = sectionId;
    console.log('Active section:', this.activeSectionId);
  }
}