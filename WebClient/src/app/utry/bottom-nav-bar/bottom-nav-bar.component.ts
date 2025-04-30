import { Component , Output, EventEmitter, Input, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SizeAndFitExpansionPanelComponent } from '../size-and-fit-expansion-panel/size-and-fit-expansion-panel.component';
import { ModelViewerComponent } from "../../model-viewer/model-viewer.component";
import { ImageGalleryComponent } from '../../image-gallery/image-gallery.component';

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
],
  templateUrl: './bottom-nav-bar.component.html',
  styleUrls: ['./bottom-nav-bar.component.css'] 
})
export class BottomNavBarComponent {
   // Track the currently active section, default to 'size-fit'
    // Use @Input if parent needs to set the initial active section
  @Input() activeSectionId: string = 'size-fit';
  @Output() sectionSelected = new EventEmitter<string>(); // Emit selected section ID

  navItems: NavItem[] = [
    { id: 'size-fit', label: 'Size & fit', icon: 'straighten' },
    { id: 'compare', label: 'Compare', icon: 'compare_arrows' },
    { id: 'materials', label: 'Materials', icon: 'texture' },
    { id: 'style', label: 'Style', icon: 'checkroom' }
  ];



  // Method to EMIT the change, not change internal state directly unless needed for styling
  selectSection(sectionId: string): void {
    // Optionally update local state if needed for styling the buttons *within* the bar
     //this.activeSectionId = sectionId;

     // Emit the selected ID to the parent
    this.sectionSelected.emit(sectionId);
}

}