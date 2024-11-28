const axios = require('axios');
require('dotenv').config();

class WeatherController {
    static async getWeatherByCity(req, res) {
        try {
            const { city } = req.query;
            
            if (!city) {
                return res.status(400).json({ message: 'City name is required' });
            }

            const apiKey = process.env.OPENWEATHERMAP_API_KEY;
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

            const response = await axios.get(apiUrl);
            
            const weatherData = {
                city: response.data.name,
                temperature: response.data.main.temp,
                humidity: response.data.main.humidity,
                windSpeed: response.data.wind.speed,
                description: response.data.weather[0].description,
                icon: response.data.weather[0].icon
            };

            res.status(200).json(weatherData);
        } catch (error) {
            console.error('Weather API error:', error);
            
            if (error.response) {
                // The request was made and the server responded with a status code
                res.status(error.response.status).json({ 
                    message: 'Error fetching weather data', 
                    details: error.response.data 
                });
            } else if (error.request) {
                // The request was made but no response was received
                res.status(500).json({ 
                    message: 'No response from weather service' 
                });
            } else {
                // Something happened in setting up the request
                res.status(500).json({ 
                    message: 'Error in weather data request' 
                });
            }
        }
    }
}

module.exports = WeatherController;
