const express = require('express');
const WeatherController = require('../controllers/weatherController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect weather routes with authentication middleware
router.get('/current', authMiddleware, WeatherController.getWeatherByCity);

module.exports = router;
