const weatherService = require('../services/weatherService');

async function getWeather(req, res) {
    try {
        const data = await weatherService.getCurrentWeather(req.query.city);
        res.json(data);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}

module.exports = { getWeather };
