import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Use BehaviorSubject to hold the current userId and allow components to subscribe
  // Initialize with null or attempt to read from localStorage on startup
  private currentUserIdSubject = new BehaviorSubject<number | null>(this.getInitialUserId());
  public currentUserId$: Observable<number | null> = this.currentUserIdSubject.asObservable();

  constructor() { }

  // Method called by SignupComponent on success
  loginUser(userId: number): void {
    try {
      localStorage.setItem('currentUserId', userId.toString());
      this.currentUserIdSubject.next(userId); // <-- Notify subscribers
      console.log(`AuthService: Logged in user ${userId} and notified subscribers.`);
    } catch (e) {
      console.error("AuthService: Error saving userId to localStorage", e);
      // Handle error appropriately
    }
  }

  // Method called on logout or app startup
  logoutUser(): void {
    try {
      localStorage.removeItem('currentUserId');
      this.currentUserIdSubject.next(null); // <-- Notify subscribers
      console.log(`AuthService: Logged out user.`);
    } catch (e) {
      console.error("AuthService: Error removing userId from localStorage", e);
    }
  }

  // Get the current value synchronously
  getCurrentUserIdValue(): number | null {
    return this.currentUserIdSubject.value;
  }

  // Helper to initialize state on service creation/app load
  private getInitialUserId(): number | null {
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
}
