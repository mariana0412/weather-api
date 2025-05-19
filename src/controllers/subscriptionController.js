const subscriptionService = require('../services/subscriptionService');

async function subscribe(req, res) {
    try {
        await subscriptionService.subscribe(req.body);
        res.json({ message: 'Subscription successful. Confirmation email sent.' });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}

async function confirm(req, res) {
    try {
        await subscriptionService.confirmSubscription(req.params.token);
        res.json({ message: 'Subscription confirmed successfully' });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}

async function unsubscribe(req, res) {
    try {
        await subscriptionService.unsubscribe(req.params.token);
        res.json({ message: 'Unsubscribed successfully' });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}

module.exports = { subscribe, confirm, unsubscribe };
