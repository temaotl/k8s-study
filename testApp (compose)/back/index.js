require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const MAX_RETRIES = 10;
let retries = 0;

function connectToDatabase() {
    const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    db.connect((err) => {
        if (err) {
            console.error(`❌ Database connection error: ${err.code}`);
            retries++;
            if (retries >= MAX_RETRIES) {
                console.error('🚨 Maximum database connection attempts exceeded. Exiting.');
                process.exit(1);
            }
            console.log(`⏳ Retrying in 3 seconds (${retries}/${MAX_RETRIES})...`);
            setTimeout(connectToDatabase, 3000);
            return;
        }

        console.log('✅ Successfully connected to MariaDB');

        db.query(`
            CREATE TABLE IF NOT EXISTS numbers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number_list TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err);
                process.exit(1);
            }

            console.log('📦 Table "numbers" is ready');

            app.listen(PORT, () => {
                console.log(`🚀 Server running at http://localhost:${PORT}`);
            });

            setupRoutes(db);
        });
    });
}

function setupRoutes(db) {
    app.get('/api/numbers', (req, res) => {
        const numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 100));
        res.json({ numbers });
    });

    app.post('/api/numbers', (req, res) => {
        const { numbers } = req.body;

        if (!Array.isArray(numbers)) {
            return res.status(400).json({ error: 'Invalid numbers format' });
        }

        const values = JSON.stringify(numbers);
        db.query('INSERT INTO numbers (number_list) VALUES (?)', [values], (err, result) => {
            if (err) {
                console.error('Insert error:', err);
                return res.status(500).json({ error: 'Server error' });
            }

            res.json({ success: true, id: result.insertId });
        });
    });
}

connectToDatabase();

