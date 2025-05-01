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

  /**
   * Handles the form submission.
   */
  onSubmit(): void {
    this.errorMessage = null; // Clear previous messages
    this.successMessage = null;

    // Mark all fields as touched to show validation errors immediately
    this.signupForm.markAllAsTouched();

    // If form is invalid, don't proceed
    if (this.signupForm.invalid) {
      this.errorMessage = "Please correct the errors in the form.";
      console.log("Form Invalid:", this.signupForm.errors); // Log specific errors
      return;
    }

    // --- Form is valid, proceed with API call ---
    this.isLoading = true;
    const signupData: UserSignupData = this.signupForm.value; // Get data from form

    console.log('Submitting signup form data:', signupData);

    // Call the service method
    this.userService.signupUser(signupData).subscribe({
      // --- Success Case ---
      next: (response: SignupResponse) => {
        console.log('Signup successful!', response);
        this.isLoading = false;
        this.successMessage = `${response.message} Welcome, ${this.usernameControl?.value}! (Your User ID: ${response.userId})`;
        this.signupForm.reset(); // Reset form fields
        // Optionally navigate to another page (e.g., login)
        // import { Router } from '@angular/router'; needed then inject Router
        // this.router.navigate(['/login']);
      },
      // --- Error Case ---
      error: (error: Error) => {
        console.error('Signup failed:', error);
        this.isLoading = false;
        this.errorMessage = error.message; // Use the error message from the service
      },
      // --- Completion (Optional) ---
      // complete: () => console.log('Signup observable completed.')
    });
  }
}
