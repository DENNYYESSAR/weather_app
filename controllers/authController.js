const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

class AuthController {
    static async signup(req, res) {
        try {
            const { username, email, password } = req.body;
            
            // Basic validation
            if (!username || !email || !password) {
                return res.status(400).json({ message: 'Please provide all required fields' });
            }

            const userId = await User.create(username, email, password);
            
            // Generate JWT token
            const token = jwt.sign(
                { id: userId, username: username }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1h' }
            );

            res.status(201).json({ 
                message: 'User created successfully', 
                token 
            });
        } catch (error) {
            res.status(500).json({ 
                message: error.message || 'Error creating user' 
            });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Validate input
            if (!email || !password) {
                return res.status(400).json({ message: 'Please provide email and password' });
            }

            // Validate credentials
            const isValid = await User.validatePassword(email, password);
            
            if (!isValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = await User.findByEmail(email);

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, username: user.username }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1h' }
            );

            res.status(200).json({ 
                message: 'Login successful', 
                token 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Server error during login' 
            });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { email, newPassword } = req.body;
            
            // In a real app, you'd implement a password reset flow with email verification
            const user = await User.findByEmail(email);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update password logic would go here
            // This is a simplified example and should be more secure in a production app
            
            res.status(200).json({ message: 'Password reset initiated' });
        } catch (error) {
            res.status(500).json({ message: 'Error resetting password' });
        }
    }
}

module.exports = AuthController;
