// database.js
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config(); // Load .env variables

// Use path from .env or default to './db/database.db'
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'db', 'database.db');

// Ensure the db directory exists (though better-sqlite3 might create it)
const fs = require('fs');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath); //, { verbose: console.log }); // Uncomment verbose for debugging SQL

console.log(`Connected to SQLite database at ${dbPath}`);

// Enable foreign key support
db.pragma('foreign_keys = ON');

// Function to initialize tables
function initializeDatabase() {
    console.log('Initializing database tables...');

    const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    const createMeasurementsTable = `
    CREATE TABLE IF NOT EXISTS measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        measurement_type TEXT NOT NULL, -- e.g., 'weight', 'height', 'waist'
        value REAL NOT NULL,            -- The numeric value
        unit TEXT,                      -- e.g., 'kg', 'cm', 'inches' (optional)
        measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE -- If user deleted, delete their measurements
    );
    `;

    db.exec(createUserTable);
    db.exec(createMeasurementsTable);

    console.log('Database tables checked/created successfully.');
}

// Run initialization
initializeDatabase();

// Export the database connection instance
module.exports = db;