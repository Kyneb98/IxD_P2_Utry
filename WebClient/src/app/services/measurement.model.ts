export interface MeasurementInputData {
  measurementType: string;
  value: number;
  unit?: string | null; // Optional unit, allow null
}

/**
 * TEMPORARY interface used by the service to include the userId */
export interface TemporaryMeasurementInputData extends MeasurementInputData {
  userId: number;
}

/**
 * Represents a fully formed measurement object, often
 * reflecting data retrieved from the database.
 */
export interface Measurement extends MeasurementInputData {
  id: number; // Added by database
  user_id: number; // Foreign key
  measured_at: string; // Timestamp from database
}

/**
 * Structure of the successful response expected from the backend
 * after adding a single measurement.
 */
export interface AddMeasurementResponse {
  message: string;
  measurementId: number;
}

/**
 * Common structure for potential error responses from the API.
 * (Can be shared with other models/services).
 */
export interface ApiErrorResponse {
    message?: string; // General server error message
    errors?: { // Specific validation errors (from express-validator)
        msg: string;
        param: string;
        location: string;
        value?: any;
    }[];
}
export interface FailedSaveResult {
  error: true; // Literal type 'true' to distinguish it
  type: string; // Which measurement type failed (e.g., 'Weight')
  message: string; // The error message
}

/** Union type: A result from a save attempt is either success or a structured failure */
export type MeasurementSaveAttemptResult = AddMeasurementResponse | FailedSaveResult;

/**
 * Represents the details of a single measurement type
 * as returned by the profile measurement endpoint.
 */
export interface ProfileMeasurementValue {
  value: number;
  unit: string | null;
  measured_at: string; // Timestamp string from database
  id?: number; // Optional: ID of that specific measurement record
}

/**
 * Structure of the response expected from the backend when fetching
 * the standard set of user profile measurements.
 * Properties might be null if the measurement hasn't been recorded yet.
 */
export interface UserProfileMeasurements {
  weight: ProfileMeasurementValue | null;
  height: ProfileMeasurementValue | null;
  waist: ProfileMeasurementValue | null;
  chest: ProfileMeasurementValue | null;
  arms: ProfileMeasurementValue | null; // Assuming 'arms' is one value, adjust if left/right needed
  shoulders: ProfileMeasurementValue | null;
  // Add other core measurements if needed
}
