const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: parseInt(process.env.MYSQL_PORT || '25060'),
    
    // SSL Configuration for DigitalOcean MySQL
    ssl: {
        // If you need to download the CA certificate, uncomment and adjust the path
        // ca: fs.readFileSync(path.join(__dirname, '../ca-certificate.crt'))
        rejectUnauthorized: true // Important for SSL verification
    },
    
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    async query(sql, params) {
        try {
            const [results] = await pool.execute(sql, params);
            return results;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    },

    async getConnection() {
        return await pool.getConnection();
    }
};
