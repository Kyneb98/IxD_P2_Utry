import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserSignupData, SignupResponse, ApiErrorResponse } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Backend API endpoint for authentication
  private apiUrl = 'http://localhost:3000/api/auth';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { } // Inject HttpClient

  /**
   * Sends user signup data to the backend API.
   * @param userData The user's signup information (username, email, password).
   * @returns An Observable containing the success response or an error.
   */
  signupUser(userData: UserSignupData): Observable<SignupResponse> {
    const signupUrl = `${this.apiUrl}/signup`; // Full URL for the signup endpoint
    console.log('Attempting signup via service for:', userData.email);

    return this.http.post<SignupResponse>(signupUrl, userData, this.httpOptions)
      .pipe(
        catchError(this.handleError) // Use the error handler
      );
  }

  /**
   * Private method to handle HTTP errors.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred during signup!';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client/Network Error:', error.error.message);
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);

      // Try to parse a message from backend response
      const backendError = error.error as ApiErrorResponse;
      if (backendError?.message) {
          errorMessage = backendError.message; // Use specific message if available
      } else if (backendError?.errors && backendError.errors.length > 0) {
          // Concatenate validation errors
          errorMessage = backendError.errors.map(e => e.msg).join(' ');
      } else if (typeof error.error === 'string' && error.error.length < 100) { // Avoid huge HTML error pages
          errorMessage = error.error; // Use string error if simple
      } else {
          errorMessage = `Server error (Status: ${error.status})`; // Generic fallback
      }
    }
    // Return an observable that emits the processed error message.
    return throwError(() => new Error(errorMessage));
  }
}
