import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  AddMeasurementResponse,
  ApiErrorResponse,
  MeasurementInputData,
  TemporaryMeasurementInputData,
  UserProfileMeasurements,
  MeasurementUpdateData,
  UpdateMeasurementResponse,
} from './measurement.model';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {

  private measurementApiUrl = 'http://localhost:3000/api/measurements';

  // Standard HTTP headers for sending JSON data
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor( private http: HttpClient) { }

  addMeasurement(data: MeasurementInputData, userId: number): Observable<AddMeasurementResponse> {

    // Create payload required by backend,
    // including the userId passed explicitly from the component.
    const temporaryPayload: TemporaryMeasurementInputData = {
        ...data, // Spread core measurement data
        userId: userId // Add the userId
    };
    console.log('Temporary Payload:', temporaryPayload); // Debugging log

    //POST request to the backend endpoint
    return this.http.post<AddMeasurementResponse>(this.measurementApiUrl, temporaryPayload, this.httpOptions)
      .pipe(
        // Error handling using the private helper method
        catchError(this.handleError)
      );
  }

  getProfileMeasurements(userId: number): Observable<UserProfileMeasurements> {

    // Construct the URL for fetching user profile measurements.
    const profileUrl = `${this.measurementApiUrl}/user/${userId}/profile`;

    console.log(`Service fetching profile measurements from: ${profileUrl}`);

    // The GET request.
    return this.http.get<UserProfileMeasurements>(profileUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

    // --- UPDATE METHOD ---
  /**
   * Updates an existing measurement.
   * @param measurementId The ID of the measurement to update.
   * @param updateData The data to update (value, unit, and insecure userId).
   * @returns An Observable with the success response or an error.
   */
  updateMeasurement(measurementId: number, updateData: MeasurementUpdateData): Observable<UpdateMeasurementResponse> {
    const updateUrl = `${this.measurementApiUrl}/${measurementId}`; // e.g., /api/measurements/123

    // --- SECURITY WARNING ---
    // The 'updateData' object currently includes 'userId' for the backend's insecure ownership check.
    // In a secure app, the backend would use a token, and 'userId' wouldn't be in 'updateData'.
    console.warn(`SECURITY WARNING: Sending userId (${updateData.userId}) explicitly in PUT measurement payload.`);
    console.log(`Service updating measurement ID ${measurementId} with data:`, updateData);
    // --- END WARNING ---

    return this.http.put<UpdateMeasurementResponse>(updateUrl, updateData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  // --- END NEW UPDATE METHOD ---

  /**
   * Private helper method to process HTTP errors consistently.
   * Logs the error and returns an Observable that throws a user-friendly error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred while saving the measurement.'; // Default error message

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error.
      errorMessage = `Network error: ${error.error.message}`;
      console.error('Client/Network Error:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
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
          // Fallback server error message
          errorMessage = `Server error saving measurement (Status: ${error.status})`;
      }
    }

    // Return an observable that emits the processed error.
    return throwError(() => new Error(errorMessage));
  }

}
