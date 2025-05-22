import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // For navigation and routerLink
import { finalize } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card'; // Assuming a mat-card wraps this
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon'; // For the check_circle icons
import { AuthService } from '../../services/auth.service';
import { UserLoginData, LoginResponse } from '../../services/user.model'; // Import your data models
import { MatGridListModule } from '@angular/material/grid-list';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@Component({
  selector: 'app-login-in',
  imports: [CommonModule, RouterModule, ReactiveFormsModule,
  MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
  MatProgressBarModule, MatIconModule, MatGridListModule],
  templateUrl: './login-in.component.html',
  styleUrl: './login-in.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginInComponent {

loginForm: FormGroup; // Changed from signupForm
  isLoading = false;
  errorMessage: string | null = null;
  // successMessage might not be needed for login, as successful login usually navigates away
  // successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Inject your updated AuthService
    private router: Router           // Inject Router for navigation
  ) {
    // Initialize the form for login
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // Username is required
      password: ['', [Validators.required]]  // Password is required (no minlength for login)
    });
  }

  // --- Convenience Getters for template access to form controls ---
  get usernameControl(): AbstractControl | null { return this.loginForm.get('username'); }
  get passwordControl(): AbstractControl | null { return this.loginForm.get('password'); }

  /**
   * Handles the form submission for login.
   */
  onSubmit(): void {
    this.errorMessage = null;
    // this.successMessage = null;
    this.loginForm.markAllAsTouched(); // Trigger validation display

    if (this.loginForm.invalid) {
      this.errorMessage = "Please enter both username and password.";
      return;
    }

    this.isLoading = true;
    const credentials: UserLoginData = this.loginForm.value;

    console.log('LoginComponent: Attempting login with credentials:', credentials);

    // Call the AuthService's login method
    this.authService.login(credentials)
      .pipe(
        finalize(() => {
          this.isLoading = false; // Ensure loading is always reset
          console.log('LoginComponent: Login attempt finalized.');
        })
      )
      .subscribe({
        next: (response: LoginResponse) => { // response type from AuthService
          console.log('LoginComponent: Login successful!', response);
          // AuthService.login() (via tap operator) should have handled storing userId
          // and notifying subscribers. Now, navigate.
          this.router.navigate(['/profile']); // Or '/dashboard', or whatever your main app route is
        },
        error: (error: Error) => {
          console.error('LoginComponent: Login failed:', error);
          this.errorMessage = error.message; // Display the processed error from AuthService
        }
      });
  }
}
