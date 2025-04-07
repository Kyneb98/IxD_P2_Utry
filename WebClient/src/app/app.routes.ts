import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UtryComponent } from './utry/utry.component';

export const routes: Routes = [

{path: '', component: HomeComponent, pathMatch: 'full',},
{path: 'utry', component: UtryComponent},


{path: 'sign-up', component: SignUpComponent}

];
