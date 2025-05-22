import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UserLoginData, LoginResponse } from './user.model';
import { ApiErrorResponse } from './user.model';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // --- ADD API URL AND HTTP OPTIONS ---
  private apiUrl = 'http://localhost:3000/api/auth'; // Base URL for your auth backend
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  // --- END API URL AND HTTP OPTIONS ---

  private currentUserIdSubject = new BehaviorSubject<number | null>(this.getInitialUserIdFromStorage());
  public currentUserId$: Observable<number | null> = this.currentUserIdSubject.asObservable();

  // --- UPDATE CONSTRUCTOR TO INJECT HttpClient and Router ---
  constructor(
    private http: HttpClient, // Inject HttpClient
    private router: Router    // Inject Router (for navigation on login/logout)
  ) { }
  // --- END CONSTRUCTOR UPDATE ---


  // This is called INTERNALLY by the new login() method or by signup's success
  public setCurrentUser(userId: number): void {
    try {
      localStorage.setItem('currentUserId', userId.toString());
      // localStorage.setItem('authToken', token); // Save token if used
      this.currentUserIdSubject.next(userId);
      console.log(`AuthService: User session set for userId: ${userId}.`);
    } catch (e) {
      console.error("AuthService: Error saving userId to localStorage", e);
    }
  }

  public clearCurrentUser(): void {
    try {
      localStorage.removeItem('currentUserId');
      // localStorage.removeItem('authToken'); // Remove token if used
      this.currentUserIdSubject.next(null);
      console.log(`AuthService: User session cleared.`);
      // Optionally navigate to login page after logout
      this.router.navigate(['/login']);
    } catch (e) {
      console.error("AuthService: Error removing userId from localStorage", e);
    }
  }

  getCurrentUserIdValue(): number | null {
    return this.currentUserIdSubject.value;
  }

  private getInitialUserIdFromStorage(): number | null {
    try {
      const storedId = localStorage.getItem('currentUserId');
      if (storedId) {
        const parsedId = parseInt(storedId, 10);
        return isNaN(parsedId) ? null : parsedId;
      }
      return null;
    } catch (e) {
      console.error("AuthService: Error reading initial userId from localStorage", e);
      return null;
    }
  }


  // Login method to authenticate the user
  login(credentials: UserLoginData): Observable<LoginResponse> {
    console.log('AuthService: Attempting login for username:', credentials.username);
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, this.httpOptions)
      .pipe(
        tap(response => { // Use tap operator to perform side effects on success
          console.log('AuthService: Login API call successful, response:', response);
          if (response && typeof response.userId === 'number') {
            // On successful login from backend, update the session
            this.setCurrentUser(response.userId /*, response.token */); // Pass token if backend sends it
          } else {
            console.error('AuthService: Login response from backend missing valid userId.');
            // This indicates an issue with the backend response structure
            // Optionally, you could throw an error here to make the outer subscribe's error block catch it
            // throw new Error('Login successful but user ID missing from response.');
          }
        }),
        catchError(this.handleHttpError) // Use a dedicated HTTP error handler
      );
  }

  // HTTP error handling
  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred during authentication!';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      const backendError = error.error as ApiErrorResponse; // Type assertion
      if (backendError && backendError.message) {
          errorMessage = backendError.message;
      } else if (error.status === 401) { // Unauthorized
          errorMessage = 'Invalid username or password.';
      } else if (typeof error.error === 'string' && error.error.length < 150) {
          errorMessage = error.error; // Simple string error from backend
      } else {
          errorMessage = `Server error (Status: ${error.status})`;
      }
    }
    console.error('AuthService HTTP Error:', errorMessage, 'Full error object:', error);
    return throwError(() => new Error(errorMessage)); // Propagate a new Error object
  }
}
