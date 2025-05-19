const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    email:     { type: String,  required: true, unique: true },
    city:      { type: String,  required: true },
    frequency: { type: String,  required: true, enum: ['hourly','daily'] },
    confirmed: { type: Boolean, default: false },
    token:     { type: String,  required: true, unique: true },
    createdAt: { type: Date,    default: Date.now }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
