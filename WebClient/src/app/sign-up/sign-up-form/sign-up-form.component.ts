import { Component } from '@angular/core';
import { InputFieldComponent } from "./input-field/input-field.component";
import { MatCardModule } from '@angular/material/card';
import { PasswordComponent } from './password/password.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-sign-up-form',
  imports: [InputFieldComponent, MatCardModule, PasswordComponent, MatButtonModule, MatTabsModule,
    MatDividerModule, MatListModule, MatIconModule, RouterLink],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.css'
})
export class SignUpFormComponent {
buttonText: string = "Sign Up";
buttonText2: string = "Sign In";

  constructor(private router: Router) {}

  logRoute(): void {
    console.log(this.router.url);
  }
}
