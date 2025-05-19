const Subscription = require('../models/Subscription');

module.exports = {
    findByEmail: email => Subscription.findOne({ email }),
    findByToken: token => Subscription.findOne({ token }),
    findAllConfirmedByFrequency: frequency  => Subscription.find({
        confirmed: true,
        frequency: frequency
    }),
    create: data  => new Subscription(data).save(),
    deleteByToken: token => Subscription.deleteOne({ token }),
    confirm: subscription => {
        subscription.confirmed = true;
        return subscription.save();
    }
};
