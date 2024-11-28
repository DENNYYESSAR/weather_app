const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

// Signup route
router.post('/signup', AuthController.signup);

// Login route
router.post('/login', AuthController.login);

// Password reset route
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;
