import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Changed from CommonModule
import { BottomNavComponent } from './shared/bottom-nav/bottom-nav.component'; // Import the nav component

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule, // Use RouterModule for router-outlet
    BottomNavComponent // Add BottomNavComponent here
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'material-bottom-nav';
}