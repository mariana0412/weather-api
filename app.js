require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const weatherRoutes = require('./routes/weather');
const subscriptionRoutes = require('./routes/subscription');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

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
