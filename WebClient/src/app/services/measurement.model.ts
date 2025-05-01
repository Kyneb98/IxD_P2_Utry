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
