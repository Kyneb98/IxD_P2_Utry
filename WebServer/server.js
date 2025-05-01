// server.js
const express = require('express');
const cors = require('cors'); // For handling CORS if needed
require('dotenv').config(); // Load .env variables first
const db = require('./database'); // Import to ensure connection is established and tables initialized
const authRoutes = require('./routes/auth');
const measurementRoutes = require('./routes/measurements');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes (customize as needed)

// Enable parsing JSON request bodies
app.use(express.json());
// Enable parsing URL-encoded request bodies (optional, but common)
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.get('/', (req, res) => {
    res.send('Measurement Tracker API is running!');
});

// Mount the routers
app.use('/api/auth', authRoutes); // All routes in auth.js will be prefixed with /api/auth
app.use('/api/measurements', measurementRoutes); // All routes in measurements.js will be prefixed with /api/measurements

// --- Basic Error Handling Middleware (Example) ---
// Catches errors passed via next(err)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// --- Graceful Shutdown (Optional but Recommended) ---
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing SQLite database.');
    db.close((err) => {
        if (err) {
            console.error('Error closing the database connection:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});