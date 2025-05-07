import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UtryComponent } from './utry/utry.component';
import { OnboardingComponent } from './sign-up/onboarding/onboarding.component';
import { MeasuringGuideComponent } from './sign-up/onboarding/measuring-guide/measuring-guide.component';
import { ProfileComponent } from './profile/profile.component';



export const routes: Routes = [

{path: '', component: HomeComponent, pathMatch: 'full',},
{path: 'utry', component: UtryComponent},


{path: 'sign-up', component: SignUpComponent}, // Added this line for sign-up
{path: 'onboarding', component: OnboardingComponent}, // Added this line for onboarding
{path: 'measuring-guide', component: MeasuringGuideComponent}, // Added this line for measuring-guide
{path: 'profile', component: ProfileComponent}

];
