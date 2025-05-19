const express    = require('express');
const Subscription = require('../models/Subscription');
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


router.post('/', async (req, res) => {
    const { email, city, frequency } = req.body;

    if (!email || !city || !frequency) {
        return res.status(400).json({ error: 'email, city and frequency are required' });
    }
    if (!['hourly','daily'].includes(frequency)) {
        return res.status(400).json({ error: 'frequency must be hourly or daily' });
    }

    try {
        const exists = await Subscription.findOne({ email });
        if (exists) {
            return res.status(409).json({ error: 'Email already subscribed' });
        }

        const token = uuidv4();
        const sub = new Subscription({ email, city, frequency, token });
        await sub.save();

        const confirmUrl = `http://localhost:3000/confirm/${token}`;
        const message = {
            from: 'no-reply@weatherapi.app',
            to: email,
            subject: 'Confirm your Weather subscription',
            text: `Щоб підтвердити підписку на оновлення погоди для ${city}, відкрийте:\n\n${confirmUrl}`
        };
        const info = await transporter.sendMail(message);

        return res.json({ message: 'Subscription successful. Confirmation email sent.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
