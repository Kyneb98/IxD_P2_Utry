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

        // --- SECURITY WARNING ---
        // In a real application, NEVER trust the userId sent from the client body directly like this.
        // You should identify the logged-in user via a token (JWT) or session,
        // and use THAT user's ID. This example is simplified.
        const { userId, measurementType, value, unit } = req.body;

        try {
            // Optional: Verify the user actually exists
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
// NOTE: Similar security warning applies here. Authenticate the user and ensure
// they are only allowed to request their OWN measurements.
router.get(
    '/user/:userId',
    [
        param('userId', 'User ID must be an integer').isInt()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // --- SECURITY WARNING ---
        // Again, ensure the requesting user is authorized to view this userId's data.
        const userId = req.params.userId;

        try {
            const selectStmt = db.prepare(
                'SELECT id, measurement_type, value, unit, measured_at FROM measurements WHERE user_id = ? ORDER BY measured_at DESC'
            );
            const measurements = selectStmt.all(userId);

            if (!measurements || measurements.length === 0) {
                // It's okay if a user has no measurements yet, return an empty array
                return res.status(200).json([]);
            }

            res.status(200).json(measurements);

        } catch (error) {
            console.error(`Database error fetching measurements for user ${userId}:`, error);
            res.status(500).json({ message: 'Database error fetching measurements' });
        }
    }
);


module.exports = router;