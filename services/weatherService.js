const axios = require('axios');

async function getCurrentWeather(city) {
    if (!city)
        throw { status: 400, message: 'City is required' };

    try {
        const response = await axios.get(
            'http://api.weatherapi.com/v1/current.json',
            { params: { key: process.env.WEATHER_API_KEY, q: city, aqi: 'no' } }
        );
        const currentData = response.data.current;
        return {
            temperature: currentData.temp_c,
            humidity: currentData.humidity,
            description: currentData.condition.text
        };
    } catch (err) {
        if (err.response && err.response.status === 400) {
            throw { status: 404, message: 'City not found' };
        }
        throw { status: 500, message: 'Internal server error' };
    }
}

module.exports = { getCurrentWeather };
