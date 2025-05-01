// This file contains TypeScript interfaces for the data models used in the application.
// Helps define the structure of data being sent and received from the backend.

export interface UserSignupData {
  username: string;
  email: string;
  password?: string;
}

export interface SignupResponse {
  message: string;
  userId: number;
}

export interface ApiErrorResponse {
    message?: string; // For general server errors
    errors?: { // For express-validator errors
        msg: string;
        param: string;
        location: string;
        value?: any;
    }[];
}
