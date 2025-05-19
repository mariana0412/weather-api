require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const weatherRoutes = require('./routes/weatherRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`→ ${req.method} ${req.url}`);
    next();
});

app.use('/weather', weatherRoutes);
app.use('/', subscriptionRoutes);

app.get('/', (req, res) => {
    res.send('API is up and running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
