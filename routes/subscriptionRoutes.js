const express    = require('express');
const SubscriptionRoutes = require('../models/Subscription');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const router     = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/subscribe/', async (req, res) => {
    const { email, city, frequency } = req.body;

    if (!email || !city || !frequency) {
        return res.status(400).json({ error: 'email, city and frequency are required' });
    }
    if (!['hourly','daily'].includes(frequency)) {
        return res.status(400).json({ error: 'frequency must be hourly or daily' });
    }

    try {
        const exists = await SubscriptionRoutes.findOne({ email });
        if (exists) {
            return res.status(409).json({ error: 'Email already subscribed' });
        }

        const token = uuidv4();
        const sub = new SubscriptionRoutes({ email, city, frequency, token });
        await sub.save();

        const confirmUrl = `http://localhost:3000/confirm/${token}`;
        const message = {
            from: 'no-reply@weatherapi.app',
            to: email,
            subject: 'Confirm your Weather subscription',
            text: `Щоб підтвердити підписку на оновлення погоди для ${city}, відкрийте:\n\n${confirmUrl}`
        };
        const info = await transporter.sendMail(message);

        return res.json({ message: 'SubscriptionRoutes successful. Confirmation email sent.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/confirm/:token', async (req, res) => {
    const { token } = req.params;
    if (!token) {
        return res.status(400).json({ error: 'Invalid token' });
    }

    try {
        const sub = await SubscriptionRoutes.findOne({ token });
        if (!sub) {
            return res.status(404).json({ error: 'Token not found' });
        }
        if (sub.confirmed) {
            return res.json({ message: 'SubscriptionRoutes already confirmed' });
        }

        sub.confirmed = true;
        await sub.save();
        return res.json({ message: 'SubscriptionRoutes confirmed successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/unsubscribe/:token', async (req, res) => {
    const { token } = req.params;
    if (!token) {
        return res.status(400).json({ error: 'Invalid token' });
    }

    try {
        const sub = await SubscriptionRoutes.findOne({ token });
        if (!sub) {
            return res.status(404).json({ error: 'Token not found' });
        }
        await SubscriptionRoutes.deleteOne({ token });
        return res.json({ message: 'Unsubscribed successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
