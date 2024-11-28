document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const resetPasswordForm = document.getElementById('reset-password-form');

    // Login Form Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Store token in localStorage
                    localStorage.setItem('token', data.token);
                    // Redirect to dashboard
                    window.location.href = '/dashboard';
                } else {
                    // Show error message
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login');
            }
        });
    }

    // Signup Form Handler
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const response = await fetch('/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Store token in localStorage
                    localStorage.setItem('token', data.token);
                    // Redirect to dashboard
                    window.location.href = '/dashboard';
                } else {
                    // Show error message
                    alert(data.message || 'Signup failed');
                }
            } catch (error) {
                console.error('Signup error:', error);
                alert('An error occurred during signup');
            }
        });
    }

    // Reset Password Form Handler
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;

            if (newPassword !== confirmNewPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const response = await fetch('/auth/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, newPassword })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Password reset successful');
                    window.location.href = '/';
                } else {
                    alert(data.message || 'Password reset failed');
                }
            } catch (error) {
                console.error('Reset password error:', error);
                alert('An error occurred during password reset');
            }
        });
    }

    // Function to fetch weather data
    async function fetchWeather(city) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/weather/current?city=${city}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch weather');
            }

            const weatherData = await response.json();
            updateWeatherUI(weatherData);
        } catch (error) {
            console.error('Weather fetch error:', error);
            alert('Failed to fetch weather data');
        }
    }

    // Function to update weather UI
    function updateWeatherUI(weatherData) {
        const weatherContainer = document.getElementById('weather-container');
        if (weatherContainer) {
            weatherContainer.innerHTML = `
                <h2>${weatherData.city}</h2>
                <img src="${weatherData.icon}" alt="Weather Icon">
                <p>Temperature: ${weatherData.temperature}°C</p>
                <p>Feels Like: ${weatherData.feelsLike}°C</p>
                <p>Description: ${weatherData.description}</p>
                <p>Humidity: ${weatherData.humidity}%</p>
                <p>Wind Speed: ${weatherData.windSpeed} m/s</p>
            `;
        }
    }
});
