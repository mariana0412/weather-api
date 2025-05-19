const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

router.get('/', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const apiKey = process.env.WEATHER_API_KEY;
        const response = await axios.get(
            `http://api.weatherapi.com/v1/current.json`,
            {
                params: {
                    key: apiKey,
                    q: city,
                    aqi: 'no',
                },
            }
        );

        const data = response.data;
        const weather = {
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            description: data.current.condition.text,
        };

        res.json(weather);
    } catch (error) {
        if (error.response && error.response.status === 400) {
            return res.status(404).json({ error: 'City not found' });
        }
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
