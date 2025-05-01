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
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatFormField } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms'; // Import form tools
import { UserService } from '../../services/user.service'; // Import your user service
import { UserSignupData, SignupResponse } from '../../services/user.model'; // Import data models
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-sign-up-form',
  imports: [ MatCardModule, MatButtonModule, MatTabsModule,
    MatDividerModule, MatListModule, MatIconModule, RouterLink, CommonModule, MatFormFieldModule,
     MatInputModule, MatError, MatLabel, MatFormField, ReactiveFormsModule, MatProgressBarModule],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.css'
})
export class SignUpFormComponent {
buttonText: string = "Sign Up";
buttonText2: string = "Sign In";

  signupForm: FormGroup; // The reactive form group
  isLoading = false; // Flag for loading indicator
  errorMessage: string | null = null; // To display API or validation errors
  successMessage: string | null = null; // To display success message


  constructor(
    private router: Router, // Inject Router to navigate between routes
    private fb: FormBuilder, // Inject FormBuilder to create forms easily
    private userService: UserService // Inject the UserService
  ) {
     // Initialize the form
     this.signupForm = this.fb.group({
      // Define controls with initial values and validators
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // --- Convenience Getters for template access to controls ---
  get usernameControl(): AbstractControl | null { return this.signupForm.get('username'); }
  get emailControl(): AbstractControl | null { return this.signupForm.get('email'); }
  get passwordControl(): AbstractControl | null { return this.signupForm.get('password'); }
  // --- End Getters ---

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) {
      this.errorMessage = "Please correct the errors in the form.";
      return;
    }

    this.isLoading = true;
    const signupData = this.signupForm.value as UserSignupData; // Use type assertion

    this.userService.signupUser(signupData).subscribe({
      // ========================================================
      // == SUCCESS CALLBACK (next) - CODE TO ADD/MODIFY HERE ==
      // ========================================================
      next: (response: SignupResponse) => {
        this.isLoading = false;
        this.successMessage = `${response.message} Welcome, ${this.usernameControl?.value}! (Your User ID: ${response.userId})`;
        console.log('Signup successful! Response:', response);

        // --- START: Code to save userId in localStorage ---
        if (response && typeof response.userId === 'number') {
          try {
            // Log intention and value
            console.log(`Attempting to store userId: ${response.userId} in localStorage.`);

            // Store the userId. IMPORTANT: localStorage values MUST be strings.
            localStorage.setItem('currentUserId', response.userId.toString());

            // Log confirmation
            console.log(`Successfully stored 'currentUserId'=${response.userId} in localStorage.`);

          } catch (error) {
            // Handle potential errors (e.g., storage full, security restrictions)
            console.error("Error saving userId to localStorage:", error);
            // Optionally inform the user
            this.errorMessage = "Signup successful, but could not save session information. Measurements might not be saved correctly. Please ensure localStorage is enabled.";
          }
        } else {
          console.error("Signup response did not contain a valid userId:", response);
          this.errorMessage = "Signup seemed successful, but user ID was missing in the response. Cannot save session.";
        }

        // Reset the form after attempting to save the ID
        this.signupForm.reset();
        // Optionally navigate to another page here
      },
      error: (error: Error) => {
        this.isLoading = false;
        this.errorMessage = error.message;
        console.error('Signup failed:', error);
      }
    });
  }
}
