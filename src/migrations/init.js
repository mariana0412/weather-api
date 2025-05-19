const mongoose = require('../config/db');
const Subscription = require('../models/Subscription');

async function migrate() {
    try {
        await Subscription.collection.createIndex(
            { tokenExpiresAt: 1 },
            { expireAfterSeconds: 0 }
        );
        console.log('Migration done');
        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
}

migrate();