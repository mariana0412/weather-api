const express = require('express');
const { subscribe, confirm, unsubscribe } = require('../controllers/subscriptionController');
const router = express.Router();

router.post('/subscribe', subscribe);
router.get('/confirm/:token', confirm);
router.get('/unsubscribe/:token', unsubscribe);

module.exports = router;
