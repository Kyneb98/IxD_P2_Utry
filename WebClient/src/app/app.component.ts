

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BottomNavComponent } from './shared/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
      RouterModule,
      BottomNavComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Use .css
})
export class AppComponent {
  title = 'material-bottom-nav-css';
}