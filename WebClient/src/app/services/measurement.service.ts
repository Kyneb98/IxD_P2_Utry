import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  AddMeasurementResponse,
  ApiErrorResponse,
  MeasurementInputData,
  TemporaryMeasurementInputData,
} from './measurement.model';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {


  // TODO: Move to Angular environment files (env.ts)
  private measurementApiUrl = 'http://localhost:3000/api/measurements';

  // Standard HTTP headers for sending JSON data
  // Later, an HttpInterceptor would likely add the Authorization header here
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor( private http: HttpClient) { }

  addMeasurement(data: MeasurementInputData, userId: number): Observable<AddMeasurementResponse> {

    // Create the payload required by the current *insecure* backend,
    // including the userId passed explicitly from the component.
    const temporaryPayload: TemporaryMeasurementInputData = {
        ...data, // Spread the core measurement data
        userId: userId // Add the userId
    };


    // Make the POST request to the backend endpoint

    return this.http.post<AddMeasurementResponse>(this.measurementApiUrl, temporaryPayload, this.httpOptions)
      .pipe(
        // Apply error handling using the private helper method
        catchError(this.handleError)
      );
  }

  /**
   * Private helper method to process HTTP errors consistently.
   * Logs the error and returns an Observable that throws a user-friendly error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred while saving the measurement.'; // Default error message

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `Network error: ${error.error.message}`;
      console.error('Client/Network Error:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: `, error.error);

      // Attempt to extract a more specific error message from the backend response
      const backendError = error.error as ApiErrorResponse; // Type assertion
      if (backendError?.message) {
          // Use the specific message from the backend if provided
          errorMessage = backendError.message;
      } else if (backendError?.errors && backendError.errors.length > 0) {
          // Concatenate validation errors if provided (e.g., from express-validator)
          errorMessage = backendError.errors.map(e => e.msg).join(' ');
      } else if (typeof error.error === 'string' && error.error.length < 150) { // Avoid logging huge HTML errors
          // Use the raw error string if it's simple text
          errorMessage = error.error;
      } else {
          // Fallback generic server error message
          errorMessage = `Server error saving measurement (Status: ${error.status})`;
      }
    }

    // Return an observable that emits the processed error. Components can catch this.
    return throwError(() => new Error(errorMessage));
  }

  // --- Other potential methods ---
  // You would add methods here later to GET, UPDATE, or DELETE measurements.
  // For example:
  // getMyMeasurements(): Observable<Measurement[]> { /* ... logic using token ... */ }
  // deleteMeasurement(measurementId: number): Observable<any> { /* ... logic ... */ }
}
