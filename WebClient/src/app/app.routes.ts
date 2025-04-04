
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SizeFitComponent } from './size-fit/size-fit.component';
import { CompareComponent } from './compare/compare.component';
import { MaterialsComponent } from './materials/materials.component';
import { StyleComponent } from './style/style.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }, // Default route
  { path: 'size-fit', component: SizeFitComponent },
  { path: 'compare', component: CompareComponent },
  { path: 'materials', component: MaterialsComponent },
  { path: 'style', component: StyleComponent },
  { path: '**', redirectTo: '' } // Redirect unknown routes to home
];

