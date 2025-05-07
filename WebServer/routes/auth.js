const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('../database'); // Import the initialized db connection

const router = express.Router();
const saltRounds = 10; // Cost factor for bcrypt hashing

// --- Sign Up Route ---
router.post(
    '/signup',
    // Input validation rules
    [
        body('username', 'Username is required').notEmpty().trim().escape(),
        body('email', 'Please include a valid email').isEmail().normalizeEmail(),
        body('password', 'Password must be at least 6 characters long').isLength({ min: 8 }),
    ],
    (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            // Check if user already exists (by username or email)
            const checkUserStmt = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?');
            const existingUser = checkUserStmt.get(username, email);

            if (existingUser) {
                return res.status(400).json({ message: 'Username or Email already exists.' });
            }

            // Hash the password
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).json({ message: 'Server error during password hashing' });
                }

                // Store the new user in the database
                try {
                    const insertStmt = db.prepare(
                        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)' // "?" acts as a placeholder for the values
                    );
                    const info = insertStmt.run(username, email, hash);

                    console.log(`User created with ID: ${info.lastInsertRowid}`);
                    // Respond with success (don't send back the password hash!)
                    res.status(201).json({
                        message: 'User created successfully!',
                        userId: info.lastInsertRowid, // Send back the new user's ID
                    });
                } catch (dbError) {
                     // Catch potential UNIQUE constraint errors again just in case (race condition, though unlikely with check above)
                    if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                         return res.status(400).json({ message: 'Username or Email already exists.' });
                    }
                    console.error('Database error during user insertion:', dbError);
                    res.status(500).json({ message: 'Database error creating user' });
                }
            });
        } catch (error) {
            console.error('Error checking for existing user:', error);
            res.status(500).json({ message: 'Server error checking user existence' });
        }
    }
);

module.exports = router;