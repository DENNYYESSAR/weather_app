const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        
        try {
            const result = await db.query(sql, [username, email, hashedPassword]);
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Username or email already exists');
            }
            throw error;
        }
    }

    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const results = await db.query(sql, [email]);
        return results[0];
    }

    static async validatePassword(email, password) {
        const user = await this.findByEmail(email);
        if (!user) return false;
        
        return await bcrypt.compare(password, user.password);
    }
}

module.exports = User;
