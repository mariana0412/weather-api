const { v4: uuidv4, validate: uuidValidate } = require('uuid');
const repo = require('../repositories/subscriptionRepository');
const mailer = require('../config/mailer');

async function subscribe({ email, city, frequency }) {
    if (!email || !city || !frequency)
        throw { status: 400, message: 'Email, city and frequency are required' };

    if (!['hourly', 'daily'].includes(frequency))
        throw { status: 400, message: 'Frequency must be hourly or daily' };

    if (await repo.findByEmail(email))
        throw { status: 409, message: 'Email already subscribed' };

    const token = uuidv4();
    const subscription = await repo.create({ email, city, frequency, token });

    const confirmUrl = `http://localhost:${process.env.PORT || 3000}/confirm/${token}`;
    await mailer.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirm your Weather subscription',
        text: `Щоб підтвердити підписку для ${city}: ${confirmUrl}`
    });

    return subscription;
}

async function confirmSubscription(token) {
    const subscription = await getSubscriptionByValidToken(token)
    if (subscription.confirmed)
        return subscription;

    return repo.confirm(subscription);
}

async function unsubscribe(token) {
    await getSubscriptionByValidToken(token)
    await repo.deleteByToken(token);
}

async function getSubscriptionByValidToken(token) {
    if (!token || !uuidValidate(token))
        throw { status: 400, message: 'Invalid token' }

    const subscription = await repo.findByToken(token)
    if (!subscription)
        throw { status: 404, message: 'Token not found' }

    return subscription
}

module.exports = {
    subscribe,
    confirmSubscription,
    unsubscribe
};
