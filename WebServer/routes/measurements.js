// routes/measurements.js
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const db = require('../database');

const router = express.Router();

// --- Add a new measurement ---
router.post(
    '/',
    [
        body('userId', 'User ID is required and must be an integer').isInt(),
        body('measurementType', 'Measurement type is required').notEmpty().trim().escape(),
        body('value', 'Value is required and must be a number').isNumeric(),
        body('unit', 'Unit must be text if provided').optional().isString().trim().escape(),
    ],
    (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        
        const { userId, measurementType, value, unit } = req.body;

        try {
            //Verify the user actually exists
            const userCheckStmt = db.prepare('SELECT id FROM users WHERE id = ?');
            const userExists = userCheckStmt.get(userId);
            if (!userExists) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Insert the measurement
            const insertStmt = db.prepare(
                'INSERT INTO measurements (user_id, measurement_type, value, unit) VALUES (?, ?, ?, ?)'
            );
            const info = insertStmt.run(userId, measurementType, parseFloat(value), unit || null); // Store unit as null if not provided

            console.log(`Measurement added with ID: ${info.lastInsertRowid} for user ${userId}`);
            res.status(201).json({
                message: 'Measurement added successfully!',
                measurementId: info.lastInsertRowid,
            });
        } catch (error) {
            console.error('Database error adding measurement:', error);
            // Check for foreign key constraint error (if user_id doesn't exist, though we checked above)
            if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
                return res.status(400).json({ message: 'Invalid User ID provided.' });
            }
            res.status(500).json({ message: 'Database error adding measurement' });
        }
    }
);

// --- Get all measurements for a specific user ---
router.get(
    
    '/user/:userId/profile',
    [ // Validation for the URL parameter
        param('userId', 'User ID must be an integer').isInt()
    ],
    (req, res) => {
        // Validate input parameter
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = parseInt(req.params.userId, 10);
        console.log(`Backend: Received request for profile measurements for user ID: ${userId}`);

        // Define the specific measurement types for profile object
        const profileMeasurementTypes = [
            'Weight',
            'Height',
            'Waist',
            'Chest',
            'Arms',
            'Shoulders',
            'Front Bodice' // Match the exact strings used when saving
        ];

        // Initialize the response object with nulls for all expected properties
        const profileData = {
            weight: null,
            height: null,
            waist: null,
            chest: null,    
            arms: null,
            shoulders: null,
            front_bodice: null,
        };

        try {
            // --- Query Database for Each Type ---
            // Prepare a statement to fetch the latest measurement for each type

            const stmt = db.prepare(`
                SELECT value, unit, measured_at, id
                FROM measurements
                WHERE user_id = ? AND measurement_type = ?
                ORDER BY measured_at DESC
                LIMIT 1
            `);

            for (const type of profileMeasurementTypes) {
                const measurementRecord = stmt.get(userId, type); // Get latest for this type

                // Convert the 'Measurement Type' string into the object key
                // (e.g., 'Front Bodice' becomes 'front_bodice')
                const objectKey = type.toLowerCase().replace(/\s+/g, '_');

                // Check if the key exists on profileData object before assigning
                if (profileData.hasOwnProperty(objectKey)) {
                    if (measurementRecord) {
                        // If a record was found, structure it for frontend
                        profileData[objectKey] = {
                            value: measurementRecord.value,
                            unit: measurementRecord.unit,
                            measured_at: measurementRecord.measured_at,
                            id: measurementRecord.id
                        };
                    } else {
                        // If no record found, set to null
                        profileData[objectKey] = null;
                    }
                } else {
                    console.warn(`Backend: Mismatch - Measurement type "${type}" does not have a corresponding key "${objectKey}" in profileData object.`);
                }
            }

            // --- Send the Structured Object Response ---
            console.log(`Backend: Sending structured profile data for user ${userId}:`, profileData);
            res.status(200).json(profileData); // Send the object, not an array

        } catch (err) {
            console.error(`Backend: Database error fetching profile for user ${userId}:`, err);
            res.status(500).json({ message: 'Database error fetching profile measurements.', error: err.message });
        }
    }
);

// --- Update an existing measurement ---
router.put(
    '/:measurementId',
    [
        param('measurementId', 'Measurement ID must be an integer').isInt(),
        body('value', 'Value is required and must be a number').isNumeric(),
        body('unit', 'Unit must be text if provided').optional().isString().trim().escape(),
        body('userId', 'User ID is required and must be an integer').isInt(), // For ownership check (insecure, but matches your current pattern)
    ],
    (req, res) => {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const measurementId = parseInt(req.params.measurementId, 10);
        const { value, unit, userId } = req.body;

        try {
            // Check if measurement exists and belongs to user
            const checkStmt = db.prepare('SELECT * FROM measurements WHERE id = ? AND user_id = ?');
            const measurement = checkStmt.get(measurementId, userId);
            if (!measurement) {
                return res.status(404).json({ message: 'Measurement not found or does not belong to user.' });
            }

            // Update the measurement
            const updateStmt = db.prepare(
                'UPDATE measurements SET value = ?, unit = ? WHERE id = ?'
            );
            updateStmt.run(parseFloat(value), unit || null, measurementId);

            res.status(200).json({ message: 'Measurement updated successfully!', updatedMeasurement: { id: measurementId, value, unit } });
        } catch (error) {
            console.error('Database error updating measurement:', error);
            res.status(500).json({ message: 'Database error updating measurement.' });
        }
    }
);

module.exports = router;